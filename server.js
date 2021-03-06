/*******************************
 * 
 * MODULES USED
 * 
 *******************************/

const express = require('express');             // is an NPM package to install. Makes coding servers much faster.
const bodyParser = require('body-parser');      // is an NPM package to install. Parses incoming request bodies in a middleware.
const fs = require('fs');                       // included with every distro of Node.js
const cors = require('cors');                   // is an NPM package to install. Resolves CORS errors
const dotenv = require('dotenv');
dotenv.config();
console.log("New process port: ");
console.log(process.env.PORT);
// MongoDB stuff
const {MongoClient} = require('mongodb');

/******************************
 * 
 * GLOBAL VARIABLES
 * 
 ******************************/
const PORT = 80;                    // port used on the server. Default port should be 80.
const dbFile = './db.json';         // db file to write to since we don't know how to use databases.
//la;kjdsfsf;dlkj

//a
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
// just in case CORS() middleware doesn't work, set access-control parameters ourselves.
app.use(function(req,res,next) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // allow anyone in the world to request things.
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})

// IP logging middleware
app.use((req, res, next) => {
    let ip = req.headers['x-real-ip'] || req.socket.remoteAddress;
    if(!ip) {
        console.log("No IP address found...");
        next();
        return;
    }
    let date_ob = new Date();

    fs.appendFile('./connectedipaddress.txt', ip + ' at ' + date_ob.toString() + '\r\n', (err, data) => {
        if(err) {
            throw err;
        }
        console.log(`IP Address ${ip} logged at ${date_ob.toString()}`);
    })
    next();
})

// Input logging middleware
app.use((req, res, next) => {
    let ip = req.headers['x-real-ip'] || req.socket.remoteAddress;
    if(!ip) {
        console.log("No IP address found...");
        next();
        return;
    }

    if(req.method === 'POST') {
        console.log('POST request made');
        let POST_body = req.body;
        let POST_log = ip + " made a POST request. Body: ";
        if(req.body) {
            POST_log += JSON.stringify(req.body);
        } else {
            POST_log += "none."
        }
        fs.appendFile('./postrequests.txt', POST_log, (err, data) => {
            if(err) throw err;

            console.log("POST Request logged.");
            console.log(POST_log);
        })
    } else if ( req.method === 'GET') {
        console.log('GET request made');
    }
    next();
})


/*******************
 * 
 * 
 * Database functions
 * 
 */

const mongodbURI = "mongodb://localhost:27017/"
const mclient = new MongoClient(mongodbURI);



// mclient.connect();

// Initial db reading
let dailyTasksDB, generalTasksDB, finishedTasksDB;
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
    finishedTasksDB = db.finishedtasks;
})
 

function updateDailyDB(task = null) {
    if(!task) return;
    let taskName = task.name
    let taskDate = task.date;
    dailyTasksDB[taskName] = taskDate;
    let newdb = {"dailytasks": dailyTasksDB,
                "generaltasks": generalTasksDB,
                "finishedtasks": finishedTasksDB}

    fs.writeFile(dbFile,JSON.stringify(newdb, null, 2),(err,data) => {
        if(err) return console.log(err);
        console.log(JSON.stringify(newdb, null, 2));
        console.log("Writing to " + dbFile)
    })
}
function updateFinishedDB(task=null) {
    if(!task) return;
    let taskName = task.name
    let taskDate = task.date;
    finishedTasksDB[taskName] = taskDate;
    let newdb = {"dailytasks": dailyTasksDB,
                "generaltasks": generalTasksDB, 
                "finishedtasks": finishedTasksDB}

    fs.writeFile(dbFile,JSON.stringify(newdb, null, 2),(err,data) => {
        if(err) return console.log(err);
        console.log(JSON.stringify(newdb, null, 2));
        console.log("Writing to " + dbFile)
    })
}
function updateGeneralDB(task=null) {
    if(!task) return;
    let taskName = task.name
    let taskDate = task.date;
    generalTasksDB[taskName] = taskDate;
    let newdb = {"dailytasks": dailyTasksDB,
                "generaltasks": generalTasksDB, 
                "finishedtasks": finishedTasksDB}

    fs.writeFile(dbFile,JSON.stringify(newdb, null, 2),(err,data) => {
        if(err) return console.log(err);
        console.log(JSON.stringify(newdb, null, 2));
        console.log("Writing to " + dbFile)
    })
}

function removeFromGeneralDB(task=null) {
    if(!task) return;
    let taskName = task.name;
    delete generalTasksDB[taskName];
    let newdb = {"dailytasks": dailyTasksDB,
                "generaltasks": generalTasksDB, 
                "finishedtasks": finishedTasksDB}

    fs.writeFile(dbFile,JSON.stringify(newdb, null, 2),(err,data) => {
        if(err) return console.log(err);
        console.log(JSON.stringify(newdb, null, 2));
        console.log("Writing to " + dbFile)
    })
}

function getDailyDB() {
    return dailyTasksDB;
}

function getFinishedDB() {
    return finishedTasksDB;
}
function getGeneralDB() {
    return generalTasksDB;
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

app.get('/db/dailytasksmongo/getall', (req, res) => {
    mclient.connect('');
})


app.get('/db/generaltasks', (req, res) => {
    res.json(
        generalTasksDB
    )
    res.end();
})

app.post('/db/generaltasks', (req, res) => {
    let task = req.body
    console.log(task);
    updateGeneralDB(task);

    // on the client side, update the body with new list
    res.json(getGeneralDB());
    res.end();
})

app.delete('/db/generaltasks', (req, res) => {
    let task = req.body;
    console.log('deleting this object from general DB... :')
    console.log(task);

    removeFromGeneralDB(task);
})


app.get('/db/finishedtasks', (req, res) => {
    res.json(
        finishedTasksDB
    )
    res.end();
})

app.post('/db/finishedtasks', (req, res) => {
    let task = req.body
    updateFinishedDB(task);

    // on the client side, update the body with new list
    res.json(getFinishedDB());
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




app.listen(process.env.PORT ||  PORT, () => {
    console.log(`Listening on port ${process.env.PORT || PORT}...`);
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