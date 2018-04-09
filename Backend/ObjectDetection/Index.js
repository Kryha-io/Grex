var fetch 			= require('node-fetch');
var fs 				= require('fs');
var cors 			= require('cors')

var PythonShell 	= require('python-shell');

// express
const express 		= require('express');
const bodyParser 	= require('body-parser');
const logger 		= require('morgan');
const app 			= express();

// printing
var chalk 			= require('chalk');

app.use(bodyParser.json())
app.use(cors())


app.post('/api/detectObject', (req, res) => {
    return new Promise((resolve, reject) => {
        const options = {
            args: [req.body.matrix]
        }
        console.log('image: body, ', req.body)

        if (req.body.matrix === undefined) {
            console.error('No image found')
            res.writeHead(400)
            reject(res.end())

        } else {
            PythonShell.run('ObjectDetection/ObjectDetection.py', options, (err,result) => {
                if (err) throw err;

                res.writeHead(200)
                resolve(res.end())
            });
        }
    })
})

app.listen(6969, () => {
    console.log('detection is a gogo')
})
