const BigchainDB    = require('../BigchainDB/ORMInterface');

class Grid {
    constructor(name = 'SEARCHANDRESCUE', size, drones={}) {
        this.keypair = BigchainDB.createKeyPair();
        this.name = name;
        this.sizeX = size.x;
        this.sizeY = size.y;
        this.drones = drones;
        this.grid = this.createGrid(size);
        this.updateGrid = this.updateGrid.bind(this);
        this.addDrone = this.addDrone.bind(this);
        this.addObstacle = this.addObstacle.bind(this);
        this.addObstacle = this.addObstacle.bind(this);
        this.addObject = this.addObject.bind(this);
        this.moveDrone = this.moveDrone.bind(this);


        this.data = {
            name: this.name,
            size: size,
            // grid: this.grid,
            drones: drones
        }

        console.log('we griddin', this.data)
        // console.log(this.data)
        BigchainDB.create(this.keypair, this.data, 'gridModel').then((grid) => {

            this.id = grid.id;
            console.log(grid.data, grid.id, grid);

            this.updateGrid();
        }).catch((e) => {
            console.log(e)
        });
    }

    updateGrid() {
        console.log('updateGrid')
        BigchainDB.retrieve('', 'droneModel').then(drones => { 
            console.log(drones)
            drones = drones.map(drone => {
                this.grid[drone.location.x][drone.location.y].drone = drone.id;
                this.grid[drone.location.x][drone.location.y].object = drone.object_detected;
                return drone.id
            })


            this.data.grid = this.grid;
            this.data.drones = drones;
            BigchainDB.append(this.id, this.keypair, this.data, 'gridModel');
        });

        setTimeout(this.updateGrid.bind(this), 1000*5);
    }

    createGrid(size) {
        var grid = new Array(size.x);

        for (var i = 0; i < grid.length; i++) {
            grid[i] = new Array();

            for(var j = 0; j < size.y; j++) {
                grid[i].push({'drone':null, 'obstacle':null,  'object':null});
            }
        }

        return grid;
    }

    addDrone(id, location) {
        this.grid[location.x][location.y].drone = id;
        this.drones.id = location;

        this.data.drones = this.drones;
        this.data.grid = this.grid;
        BigchainDB.append(this.id, this.keypair, this.data, 'gridModel');
    }

    addObstacle(location) {
        this.grid[location.x][location.y].obstacle = true;
        
        this.data.grid = this.grid;
        BigchainDB.append(this.id, this.keypair, this.data, 'gridModel');
    }

    addObject(id, location) {
        this.grid[location.x][location.y].object = id;

        this.data.grid = this.grid;
        BigchainDB.append(this.id, this.keypair, this.data, 'gridModel');
    }

    moveDrone(id, location) {
        var drone = this.drones.id;
        this.grid[drone.x][drone.y].drone = null;

        this.drones.id.x = x;
        this.drones.id.y = y;
        this.grid[location.x][location.y].drone = id;

        this.data.grid = this.grid;
        this.data.drones = this.drones;
        BigchainDB.append(this.id, this.keypair, this.data, 'gridModel');
    }
}

module.exports = Grid;