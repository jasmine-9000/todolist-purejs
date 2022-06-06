/*******************************
 * 
 * MODULES USED
 * 
 *******************************/

const express = require('express');             // is an NPM package to install. Makes coding servers much faster.
const bodyParser = require('body-parser');      // is an NPM package to install. Parses incoming request bodies in a middleware.
const fs = require('fs');                       // included with every distro of Node.js
const cors = require('cors');                   // is an NPM package to install. Resolves CORS errors

// MongoDB stuff
const {MongoClient} = require('mongodb');

/******************************
 * 
 * GLOBAL VARIABLES
 * 
 ******************************/
const PORT = 80;                    // port used on the server. Default port should be 80.
const dbFile = './db.json';         // db file to write to since we don't know how to use databases.
const mongodbAddr = "http://localhost:27017"


/*********************
 * 
 * GLOBAL OBJECTS AND MIDDLEWARE
 * 
 **********************/

const router = express.Router()
const app = express();                
app.use("/", router);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cors());// fixing CORS issues
app.use(function(req,res,next) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // allow anyone in the world to request things.
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})
/*******************
 * 
 * 
 * Database functions
 * 
 */

const mclient = new MongoClient(mongodbAddr);

await mclient.connect();

// Initial db reading
let dailyTasksDB, generalTasksDB;
fs.readFile(dbFile, (err, data) => { 
    // error handling
    if(err) {
        console.log("Error reading database");
        return;
    }
    // parse data in JSON form. 
    let db = JSON.parse(data);
    dailyTasksDB = db.dailytasks;
    generalTasksDB = db.generaltasks;
})
 

async function updateDailyDB(task= null) {
    if(!task) return;
    let taskName = task.name
    let taskDate = task.date;
    dailyTasksDB[taskName] = taskDate;
    let newdb = {"dailytasks": dailyTasksDB,
                "generaltasks": generalTasksDB}

    fs.writeFile(dbFile,JSON.stringify(newdb, null, 2),(err,data) => {
        if(err) return console.log(err);
        console.log(JSON.stringify(newdb, null, 2));
        console.log("Writing to " + dbFile)
    })
}

function getDailyDB() {
    return dailyTasksDB;
}



app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
})
app.get('/styles.css', (req, res) => {
    res.sendFile(__dirname + "/styles.css");
})
app.get('/script.js', (req, res) => {
    res.sendFile(__dirname + '/script.js');
})

app.get('/db/dailytasks', (req, res) => {
    res.json(dailyTasksDB);
    res.end();
})

app.post('/db/dailytasks', (req, res) => {
    let task = req.body.task
    console.log(task);
    updateDailyDB(task);

    // on the client side, update the body with new list
    res.json(getDailyDB());
    res.end();
})

app.get('/db/generaltasks', (req, res) => {
    res.json(
        generalTasksDB
    )
    res.end();
})

app.post('/login', (req, res) => {
    console.log("**************************")
    console.log(req.body);
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
    console.log(req.route);
    console.log("-----------------------------------")
    console.log(req.params);
    console.log("-----------------------------------")
    console.log(req.body);
    console.log("-----------------------------------")
    console.log(req.method);
    console.log("-----------------------------------")
    console.log(req.statusCode);
    console.log(req.readableLength);
    res.end(JSON.stringify({"hello": "world"}));
})






app.get('/db', (req, res) => {
    res.json({"error": 404})
})




app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
})

/*
    New JSON File structure:

    {
        uuid1: {
            "name": task1name,
            "date": task1name
        },
        uuid2: {
            "name": task2name,
            "date": task2name
        }
    }
*/