const bdbOrm        = require('bigchaindb-orm');
const DB_ENDPOINT   = require("./const.js").db;
const driver        = require('bigchaindb-driver')


class ORMInterface {
    constructor() {
        // console.log(bdbOrm.default())
        this.bdbOrm = new bdbOrm.default(DB_ENDPOINT, {
            app_id: 'DRONECONNECT',
            app_key: 'CLICK CLICK UNLOCK'
        });

        this.bdbOrm.define("droneModel", {
            id: String,
            location: Object,
            action: String,

            object_detected: Boolean,
            battery: Number,
            cost: Number,
            type: String
        });


        this.bdbOrm.define("gridModel", {
            type: String,
            size: Object,
            drones: Object,
            grid: Object,
            name: String
        });
    }

    createKeyPair() {
        return new driver.Ed25519Keypair()
    }

    create(keypair, data, type) {
        // console.log(keypair, data,type)
        return this.bdbOrm[type].create({
            keypair: keypair,
            data: data
        }).then(object => {
            return object;
        }).catch((e) => {
            console.log('error', e)
            return e;
        });
    }

    retrieve(id, type) {
        return this.bdbOrm[type].retrieve(id).then(objects => {
            return objects;
        }).catch((e) => {
            return e;
        });
    }

    append(asset, keypair, data) {
        return asset.append({
            toPublicKey: keypair.publicKey,
            keypair: keypair,
            data: data
        }).then(object => {
            return object;
        }).catch((e) => {
            return e;
        });
    }
}

module.exports = new ORMInterface()
// export default const bla = new BigChainDBInterface
