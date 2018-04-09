const Drone = require("./DroneAPI.js")
const chalk = require('chalk');


console.log(Drone);

class FakeDrone extends Drone {
    constructor(id, init_location) {
        super(id, init_location, true)
        this.currentBattery = 0
    }

    goto(location) {
        this.location = location
        console.log(this.bdbDrone);
        this.setStateBigchain()
    }

    getVideoData() {
        return
    }

    getBatteryLifePromise() {
        return new Promise(function(resolve, reject) {
            resolve(0)
        });
    }
}

var d = new FakeDrone("test", {x: 20, y: 20})

console.log(d.location);

setTimeout(() => d.goto({x:10, y:10}), 1000)

console.log(d.location);


module.exports = FakeDrone;
