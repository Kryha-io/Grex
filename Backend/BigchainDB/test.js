var bdbOrm        	= require('bigchaindb-orm');
const DB_ENDPOINT   = require("./const.js").db;
const driver        = require('bigchaindb-driver');


bdbOrm = new bdbOrm.default(DB_ENDPOINT, {
    app_id: 'DRONECONNECT',
    appKey: 'CLICK CLICK UNLOCK'
})

console.log(bdbOrm)
// bdbOrm.appId = 'DRONECONNECT';

bdbOrm.define("droneModel");

var type = 'droneModel';
var keypair = new driver.Ed25519Keypair();

bdbOrm.droneModel.create({
    keypair: keypair,
    data: {poep: 'poep'}
}).then(object => {
	console.log(object, object.id, object.data)

	bdbOrm.droneModel.retrieve('').then(objects => {
		console.log(objects)
		// objects.map(droneModel => {
		// 	droneModel.append({
		// 		toPublicKey: keypair.publicKey,
		// 		keypair: keypair,
		// 		data: {oh: 'nee'}
		// 	}).then(updated => {
		// 		console.log(updated.data)
		// 	}).catch(e => {
		// 		console.log(e)
		// 	})
		// })
		
	    return objects;
	}).catch((e) => {
	    return e;
	});

    return object;
}).catch((e) => {
    console.log('error', e)
    return e;
});
var id = 'id::7b878157-f7c6-4f9e-836e-e54d2db23690';

