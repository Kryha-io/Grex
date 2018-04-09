const driver = require('bigchaindb-driver')

const DB_ENDPOINT = require("./const.js").db

class BigChainDBInterface {
    constructor() {
        this.conn = new driver.Connection(`http://${DB_ENDPOINT}`)
    }

    createKeyPair() {
        return new driver.Ed25519Keypair()
    }


    makeSignedTx(assetdata, metadata, keypair) {
        let tx = driver.Transaction.makeCreateTransaction(
            assetdata,
            metadata,
            [
                driver.Transaction.makeOutput(
                    driver.Transaction.makeEd25519Condition(keypair.publicKey)
                )
            ],
            keypair.publicKey
        )

        return driver.Transaction.signTransaction(tx, keypair.privateKey)
    }

    postTransaction(signedTx) {
        return new Promise(function(resolve, reject) {
            this.conn.postTransaction(signedTx)
                .then(() => this.conn.pollStatusAndFetchTransaction(signedTx.id))
                .then(retrievedTx => resolve)
        }.bind(this));
    }
}

// var test = new BigChainDBInterface()
//
// var keypair = test.createKeyPair()
// var tx = test.makeSignedTx({}, {"type": "poepen"}, keypair)
//
// test.postTransaction(tx)

module.exports = new BigChainDBInterface()
