const MongoClient = require('mongodb').MongoClient;
const URL = "mongodb://localhost:27017/";

MongoClient.connect(URL, function(err, db) {
    if(err) throw err;
    let dbo = db.db("100devs");
    dbo.createCollection("customers", (err, res) => {
        if(err) throw err;
        console.log("Collection created!");
        db.close();
        
    })
})