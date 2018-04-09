const Drone 		= require('./AgentModel/DroneAPI.js');
const FakeDrone		= require('./AgentModel/FakeDroneAPI.js')

const BigchainDB	= require('./BigchainDB/ORMInterface');

class DroneWrapper {
	constructor(id = 'SEARCHANDRESCUE_TEST', simulated = true, location= {x: 0, y:0}) {
		// this.createDroneBigchain = this.createDroneBigchain.bind(this);
		this.listenForActions = this.listenForActions.bind(this);
		this.checkClosest = this.checkClosest.bind(this);



		if (!simulated) {
			this.drone = new Drone('SEARCHANDRESCUE_TEST', location);
		} else {
			this.drone = new FakeDrone('SEARCHANDRESCUE_TEST', location)

			// var goto = (location) => {
			// 	console.log('gogo', location)
			// 	this.drone.location = location;
			//
			// 	this.bdbDrone.append({
	        //         toPublicKey: this.drone.keypair.publicKey,
	        //         keypair: this.drone.keypair,
	        //         data:  {
			// 			location: location,
			// 			currentBattery: this.drone.currentBattery,
			// 			id: this.drone.id,
			// 			action: this.drone.action,
			// 			keypair: this.drone.keypair
			// 		}
	        //     }).then((updatedDrone) => {
	        //     	console.log('updatedDrone', updatedDrone.data)
	        //     	this.bdbDrone = updatedDrone;
	        //     }).catch(console.log)
			//
			// 	// this.bdbDrone.append(this.drone.dbid, this.drone.keypair, {
			// 	// 	location: location,
			// 	// 	currentBattery: this.drone.currentBattery,
			// 	// 	id: this.drone.id,
			// 	// 	action: this.drone.action,
			// 	// 	keypair: this.drone.keypair
			// 	// }, 'droneModel').then((bla) => {
			// 	// 	console.log('hoi', bla)
			// 	// })
 			// }
			//
			// this.drone = {
			// 	location: location,
			// 	currentBattery: 10,
			// 	id: 'SEARCHANDRESCUE_TEST',
			// 	action: 'EXPLORE',
			// 	goto: goto.bind(this),
			// 	keypair: BigchainDB.createKeyPair()
			// }
			//
			// this.createDroneBigchain();
		}
		this.action = 'EXPLORE';
		this.mission = this.getMission(this.drone.id);

		this.listenForActions();
	}

	// createDroneBigchain() {
    //     var data = {
    //         id: this.id,
    //         type: "create_drone"
    //     }
	//
    //     BigchainDB.create(this.drone.keypair, data, "droneModel").then((drone) => {
    //     	this.dbid = drone.id
    //     	this.bdbDrone = drone;
    //     	console.log(this.dbid, drone.data, drone._schema.id())
	//
    //     });
    // }


	listenForActions() {
		console.log('listener called', this.dbid)
		let prom =  new Promise((resolve, reject) => {
			BigchainDB.retrieve('', 'droneModel').then(drones => {
				console.log('we retrievin')
				// const detected = this.checkDetected(drones);
				const detected = false;
				if (this.drone.currentBattery < 10) {
					console.log('Low battery');
					resolve();
				} else if (detected) {
					console.log('Detected');
					const closest = this.checkClosest(drones, detected);

					if (closest) {
						this.drone.goto(detected).then(() => {
							resolve();
						}).catch(e => reject(e));
					}

					resolve();
				} else {
					console.log('what', this.drone.action)
					if (this.drone.action == 'EXPLORE') {
						// generate move
						console.log('Exploring');
						if (Math.random() > 0.5) {
							var newX = this.drone.location.x + 1;

							if (newX < 100) {
								this.drone.goto({x: this.drone.location.x + 1, y: this.drone.location.y})
							} else {
								this.drone.goto({x: this.drone.location.x - 2, y: this.drone.location.y})
							}
						} else {
							var newY = this.drone.location.y + 1;

							if (newY < 100) {
								this.drone.goto({x: this.drone.location.x, y: this.drone.location.y + 1})
							} else {
								this.drone.goto({x: this.drone.location.x, y: this.drone.location.y - 2})
							}
						}
						resolve();
					} else {
						console.log('No action found', this.drone.action);
						reject('No action found');
					}
				}

			});
		});

		const fun = this.listenForActions.bind(this)
		setTimeout(fun, 1000 * 10);
	}

	calcDistance(location1, location2) {
		var x = location1.x  - location2.x;
		var y = location1.y - location2.y;
		return Math.sqrt(x*x + y*y);
	}

	checkDetected(drones, objectLocation) {
		drones.map((drone) => {
			if (drone.object_detected === true) {
				objectLocation = drone.location;
			}
		});

		return objectLocation;
	}

	getMission(droneId) {
		const mission = droneId.split('_');

		if (mission.length === 1) {
			console.log('No mission specified');
			return 'No mission specified';
		} else {
			return mission[0];
		}
	}

	checkClosest(drones, objectLocation) {
		const distance = this.calcDistance(this.drone.location, objectLocation);
		var closest = true;

		drones.map((drone) => {
			if (distance > this.calcDistance(drone.location, objectLocation) && this.mission === this.getMission(drone.id)) {
				closest = false;
			}
		});

		return closest;
	}
}

const bla = new DroneWrapper()
