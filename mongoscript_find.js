const MongoClient = require('mongodb').MongoClient;
const URL = "mongodb://localhost:27017";


MongoClient.connect(URL, (err, db) => {
    if(err) throw err;
    const dbo = db.db("100devs");
    // find one: finds the first datum in the collection
    dbo.collection("customers").findOne({}, (err, result) => {
        if(err) throw err;
        console.log("Found one!");
        console.log(`Name: ${result.name}`);
        console.log(`Address: ${result.address}`);
        console.log("Moving to find all...")
    });

    // find all : returns all data in the collection.
    dbo.collection("customers").find({}).toArray(function(err, result) {
        if(err) throw err;
        console.log("Found these items:");
        console.log(result);
        console.log("Moving on to find some...")
    });

    // find some: returns all data with specific items. 
    // to find some, use the .find() function with a second parameter: a object with "projection" item.0.

    // this one shows "name", "address", and excludes "_id".
    dbo.collection("customers").find({}, {projection: {_id: 0, name: 1, address: 1}}).toArray(function(err, result) {
        if(err) throw err;
        console.log(result);
    })
    // this one only shows "name" field.
    dbo.collection("customers").find({}, {projection: {_id: 0, name: 1}}).toArray(function(err, result) {
        if(err) throw err;
        console.log("This one only shows 'name'.");
        console.log(result);
    })
    // this one excludes the "_id" field. 
    dbo.collection("customers").find({}, {projection: {_id: 0}}).toArray(function(err, result) {
        if(err) throw err;
        console.log("This one excludes the _id field, and shows everything else.");
        console.log(result);
    })
    // this one will throw an error. you cannot specify both 0 and 1 values in the same object. (except if one of those fields is the _id field.)
    dbo.collection("customers").find({}, {projection: {name: 1, address: 0}}).toArray(function(err, result) {
        if(err) throw err;
        console.log("This one might throw an error.");
        console.log(result);
    })

})