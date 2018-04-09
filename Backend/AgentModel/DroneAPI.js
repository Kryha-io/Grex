const sumo = require("node-jumping-night")
const dbinterface = require("../BigchainDB/ORMInterface")
const chalk = require('chalk');
const blobUtil = require('blob-util')
const fs = require('fs')
// const cv = require('opencv')
const WAITTIME = 100
const STARTUPTIME = 100


class Drone {
    constructor(id, init_location, fake=false) {
        this.id = id

        this.keypair = dbinterface.createKeyPair()
        this.dbid = null
        this._createDroneBigchain()

        this.location = init_location
        this.history = []

        this.directions = ["N", "E", "S", "W"]

        // Initial facing north
        this.facing = this.directions[0]

        // fixed speed 50
        this.speed = 50

        if (!fake) {
            this._initDrone()
        }
    }

    _initDrone() {
        this.drone = sumo.createClient()

        console.log(chalk.blue(`Trying to connect`));
        this.connected = new Promise(function(resolve, reject) {
            this.drone.connect(() => {
                console.log(chalk.blue(`Connected to drone ${id}`));
                resolve()
            })
        }.bind(this));

        this.currentBattery = 100
        this.getBatteryLifePromise().then(battery => {
            this.currentBattery = battery
        })

        this.movement = this.createMovementControls()
    }

    getBatteryLifePromise() {
        return new Promise(function(resolve, reject) {
            this.drone.on("battery", battery => {
                console.log(chalk.green(`Battery-life: ${battery}`));
                resolve(battery)
            })
        }.bind(this));
    }

    _createDroneBigchain() {
        var data = {
            id: this.id,
            type: "create_drone"
        }

        dbinterface.create(this.keypair, data, "droneModel").then((drone) => {
            this.dbid = drone.id
            this.bdbDrone = drone
            console.log(chalk.green(`Created drone on BigChainDB ${this.dbid}`));
        })
    }

    setStateBigchain() {
        this.getBatteryLifePromise().then(battery => {
            var data = {
                id:                 this.id,
                location:           this.location,
                action:             this.action,

                object_detected:    this.object_detected,
                battery:            battery,
                cost:               this.currentBattery - battery,
                keypair:            this.keypair,

                type:               "drone_update"
            }


            dbinterface.append(this.bdbDrone, this.keypair, data).then((updatedDrone) => {
                this.bdbDrone = updatedDrone;
                console.log(chalk.yellow(`Posted new transaction: ${updatedDrone.id}`));
            })

            this.currentBattery = battery
        })
    }

    getVideoData() {
        var video = this.drone.getVideoStream()

        video.on("data", function(data){
            return data
        })
    }

    goto(location) {
        return new Promise(function(resolve, reject) {
            if (this.location.x < 0 && location.x >= 0) {
                var x = location.x + Math.abs(this.location.x)
            } else {
                var x = location.x - this.location.x
            }

            if (this.location.y < 0 && location.y >= 0) {
                var y = location.y + Math.abs(this.location.y)
            } else {
                var y = location.y - this.location.y
            }

            this._goto_y(y).then(() => {
                this._goto_x(x).then(() => {
                    console.log(chalk.blue(`Finished move to: (${location.x}, ${location.y})`));

                    this.location = location
                    this.setStateBigchain()

                    setTimeout(() => {
                        resolve()
                    }, WAITTIME*10)
                })
            })
        }.bind(this));
    }

    _goto_x(x, location) {
        return new Promise(function(resolve, reject) {
            if (x !== 0) {
                this.movement.then((movement) => {
                    var forward_func  = x > 0 ? movement.forward  : movement.backward
                    var backward_func = x < 0 ? movement.backward : movement.forward

                    switch (this.facing) {
                        case "N":
                            movement.right().then(() => {
                                forward_func(Math.abs(x)).then(resolve)
                            })
                            break;
                        case "E":
                            forward_func(Math.abs(x)).then(resolve)
                            break;
                        case "S":
                            movement.left().then(() => {
                                forward_func(Math.abs(x)).then(resolve)
                            })
                            break;
                        case "W":
                            backward_func(Math.abs(x)).then(resolve)
                            break;
                        default:
                            console.log(chalk.red("IMPOSSIBLE FACING"));
                    }
                })
            } else {
                resolve()
            }
        }.bind(this));

    }

    _goto_y(y, location) {
        return new Promise(function(resolve, reject) {
            if (y !== 0) {
                this.movement.then((movement) => {
                    console.log("testing testing", this.facing);

                    var forward_func  = y > 0 ? movement.forward  : movement.backward
                    var backward_func = y < 0 ? movement.backward :  movement.forward

                    switch (this.facing) {
                        case "N":
                            backward_func(Math.abs(y)).then(resolve)
                            break;
                        case "E":
                            movement.left().then(() => {
                                forward_func(Math.abs(y)).then(resolve)
                            })
                            break;
                        case "S":
                            forward_func(Math.abs(y)).then(resolve)
                            break;
                        case "W":
                            movement.right().then(() => {
                                forward_func(Math.abs(y)).then(resolve)
                            })
                            break;
                        default:
                            console.log(chalk.red("IMPOSSIBLE FACING"));
                    }
                })
            } else {
                resolve()
            }
        }.bind(this));
    }

    _setLocation(distance, multiplier) {
        console.log(distance, distance*multiplier);

        switch (this.facing) {
            case "N":
                this.location.y -= distance * multiplier
                break;
            case "E":
                this.location.x += distance * multiplier
                break;
            case "S":
                this.location.y += distance * multiplier
                break;
            case "W":
                this.location.x -= distance * multiplier
                break;
            default:
                console.log(chalk.red("IMPOSSIBLE FACING"));
        }

        console.log(chalk.blue(`New location: (${this.location.x}, ${this.location.y})`));

        return this.location
    }

    _forward(time) {
        return new Promise(function(resolve, reject) {
            this.drone.forward(this.speed)

            setTimeout(() => {
                this.drone.stop()
                this._setLocation(time, 1)

                setTimeout(() => {
                    resolve()
                }, WAITTIME)

            }, time + STARTUPTIME)
        }.bind(this));
    }

    _backward(time) {
        return new Promise(function(resolve, reject) {
            this.drone.backward(this.speed)

            setTimeout(() => {
                this.drone.stop()
                this._setLocation(time, 1)

                setTimeout(() => {
                    resolve()
                }, WAITTIME)

            }, time + STARTUPTIME)
        }.bind(this));
    }

    _right() {
        return new Promise(function(resolve, reject) {
            var current = this.directions.indexOf(this.facing)
            var next = current + 1;

            // if greater than length then 0
            if (next >= this.directions.length) {
                next = 0
            }

            this.facing = this.directions[next]

            this.drone.right(this.speed)

            setTimeout(() => {
                this.drone.stop()

                setTimeout(() => {
                    resolve()
                }, WAITTIME)
            }, 350) // magic number; almost right

        }.bind(this));
    }

    _left() {
        return new Promise(function(resolve, reject) {
            var current = this.directions.indexOf(this.facing)
            var next = current - 1

            // if less than 0 then 0
            if (next < 0) {
                next = 0
            }

            this.facing = this.directions[next]
            this.drone.left(this.speed)

            setTimeout(() => {
                this.drone.stop()

                setTimeout(() => {
                    resolve()
                }, WAITTIME)
            }, 350) // magic number; almost left
        }.bind(this));
    }

    createMovementControls() {
        return new Promise(function(resolve, reject) {
            this.connected.then(() => {
                resolve({
                    forward: this._forward.bind(this),
                    backward: this._backward.bind(this),
                    right: this._right.bind(this),
                    left: this._left.bind(this),
                    stop: () => { this.drone.stop() },
                })
            })
        }.bind(this));
    }
}

// var d  = new Drone("test", {x: 0, y:0})

// d.setStateBigchain()

// d.goto({x: 0, y: -400}).then(() => {
//     console.log("finished");
//     d.goto({x:0, y:0}).then(() => {
//         console.log("finished2");
//     })
// })


module.exports = Drone
