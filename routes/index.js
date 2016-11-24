'use strict';

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/christmas-songs';

var indexCollection = function(db, callback) {
  db.collection('songs').createIndex(
    { title: 1, body: 1, chorus: 1, credits: 1 },
      null,
      function(err, results) {
        console.log(results);
        callback();
    }
  );
};

var findDocuments = function(db, match, callback) {
  // Get the documents collection
  var collection = db.collection('songs');
  // Find some documents
    //'body': *
    //if (match != undefined) {
      //  match = '/'+match+'/';
    //}
  if (match != undefined && match.length > 0 ) {
      //var searchPhrase = '/.*'+match+'.*/'; ///.*m.*/
      var searchPhrase = "/"+match+"/";
      console.log("searching by keyword match: "+match);
      collection.find({title: {$regex: match, $options: "i"} }).toArray(function(err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs);
        callback(docs);
      });
  } else { //.distinct('title')
      console.log("empty search happening");
      collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs);
        callback(docs);
      });
  }
}

var insertDocument = function(db, song, callback) {
  // Get the documents collection
  var collection = db.collection('songs');
  // Insert a document  
  collection.insertOne(
    { title : song.title, chorus : song.chorus, body : song.body, credits: song.credits } 
  , function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    assert.equal(1, result.ops.length);
    console.log("Inserted song into the collection");
    callback(result);
  });
}

var removeDocument = function(db, theTitle, callback) {
  // Get the documents collection
  var collection = db.collection('songs');
  // Insert some documents
  collection.deleteOne({ title : theTitle }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Removed the document equal to 'Little Drummer Boy'");
    callback(result);
  });    
}

module.exports = function(app) {
    
 app.get('/', function(req, res) {
     
     //Clear old document:
     /*MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
        var t_title = 'Little Drummer Boy';
         removeDocument(db, t_title, function() {
                console.log("removeDocument!");            
                db.close();
                res.render('pages/index');            
         });
     });*/     
     res.render('pages/index');
 });
    
 app.get('/about', function(req, res) {
   res.render('pages/about');
 });

    
 app.get('/songs', function (req, res) {
    console.log("gonna search songs");
    
    res.render('pages/search',{ songs : [] });
     
 });

 app.get('/song/add', function (req, res) {
    console.log("gonna create a song");
    //res.setHeader('Content-Type', 'application/json');
//    res.sendFile(path.join(__dirname+'/songAdd.html'));
     res.render('pages/songAdd');
 });
    
/*
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
*/

 app.post('/song/insert', function (req, res) {
    console.log("gonna insert a song");
    //console.log("request: "+req.body);
    var song = req;
    var songTitle = song.body.title;
    console.log("songTitle: "+songTitle);
    var songChorus = song.body.chorus;
    var songBody = song.body.body;
    //res.send("hi "+req);
     //var song = req.data;
    var doc = {
      title : songTitle,
      chorus : songChorus,
      body : songBody,
      credits : "Anonymous"
    }
     
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
        
        insertDocument(db, doc, function() {
            console.log("saving song to mongo db!");
            
            indexCollection(db, function() { //so its searchable
                db.close();
                res.render('pages/songAdded', { title : doc.title, chorus : doc.chorus, body : doc.body, credits: doc.credits });
            });
        });
    });
     
 });
    
 app.get('/song/search', function (req, res) {
      console.log("posting a song search.");
      var match = '';
      //var search = req;
      var keyword = req.query.keyword;
      console.log("keyword is: "+keyword);
      if (keyword != undefined) {
         match = keyword;
      }     
     
     //res.render('pages/search');
     MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
      findDocuments(db, match, function(docs) { 
            console.log("INSIDE search for match for "+match);
            db.close();
            res.render('pages/search', { songs : docs });
      });         
         
    });
     
 });
    
 app.get('/song/update', function (req, res) {
    console.log("gonna update a song");
 });
    
    
};