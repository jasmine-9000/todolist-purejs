const MongoClient = require('mongodb').MongoClient;
const URL = "mongodb://localhost:27017/";

MongoClient.connect(URL, (err, db) => {
  if (err) throw err;
  const dbo = db.db("100devs");
  const myobj = { name: "Meow", address: "Highway 38" };
  dbo.collection("customers").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});