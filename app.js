'use strict';
var express = require('express');
var app = express();

var bodyParser = require('body-parser');  
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: false }));

//var path = require('path');
//Creating Router() object
var routes = require('./routes/index.js');

app.use('/public', express.static(process.cwd() + '/public'));
//app.use('/', express.static(process.cwd() + '/'));
app.set('view engine', 'ejs');
        
//var router = express.Router();

// ================================================================
// setup routes
// ================================================================
routes(app);

// Provide all routes here, this is for Home page.

/*router.get("/", function(req, res){
  res.json({"message" : "Hello World"});
});*/

/*app.get('/',function(req,res){
       
    // res.sendFile(path.join(__dirname+'/pages/index'));
    res.render('pages/index');

});*/

// Tell express to use this router with /api before.
// You can put just '/' if you don't want any sub path before routes.

//app.use("/api",router);

// Listen to this Port

app.listen(3000,function() {
  console.log("Live at Port 3000");
});


/*var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
//var url = 'mongodb://localhost:27017/mongo-project';
var url = 'mongodb://localhost:27017/christmas-songs';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  //insertDocuments(db, function() {
    //updateDocument(db, function() {
     //removeDocument(db, function() {
      //findDocuments(db, function() {
     // indexCollection(db, function() {
       // db.close();
      //});
  //});
});

var findDocuments = function(db, match, callback) {
  // Get the documents collection
  var collection = db.collection('songs');
  // Find some documents
  collection.find({'body': match}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}

var updateDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('songs');
  // Update document where title matches
  collection.updateOne({title : song.title}
    , { $set: {
        title : song.title,
        chorus : song.chorus,
        body : song.body,
        credit: song.credits
        }
      }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated the song");
    callback(result);
  });  
}

var removeDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('songs');
  // Insert some documents
  collection.deleteOne({ a : 3 }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Removed the document with the field a equal to 3");
    callback(result);
  });    
}

var indexCollection = function(db, callback) {
  db.collection('songs').createIndex(
    { "a": 1 },
      null,
      function(err, results) {
        console.log(results);
        callback();
    }
  );
};
*/
