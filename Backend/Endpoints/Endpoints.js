// const BigchainDB    = require('../BigchainDB/Interface.js');
const BigchainDB	= require('../BigchainDB/ORMInterface');
const Grid			= require('../WorldModel/Grid');
const fetch 		= require('node-fetch');
const fs 			= require('fs');
const cors 			= require('cors');


// express
const express 		= require('express');
const bodyParser 	= require('body-parser');
const logger 		= require('morgan');
const app 			= express();

// printing
var chalk 			= require('chalk');

app.use(bodyParser.json());
app.use(cors());


app.post('/api/createMission', (req, res) => {
    return new Promise((resolve, reject) => {
    	const grid = new Grid('SEARCHANDRESCUE', {x: 100, y: 100});
    	resolve(grid);
    });
});

app.post('/api/retrieveMission', (req, res) => {
    return new Promise((resolve, reject) => {
        //console.log(req.body.id)
        BigchainDB.retrieve(req.body.id, 'gridModel').then(grid => {
            resolve(grid);
            console.log(grid);
        });
    });
});

app.post('/api/retrieveDrone', (req, res) => {
    return new Promise((resolve, reject) => {
        BigchainDB.retrieve(req.body.id, 'droneModel').then(drone => {
            resolve(drone);
        });
    });
});

app.listen(6767, () => {
    console.log('Mission creation is a gogo');
});
