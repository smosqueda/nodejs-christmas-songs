'use strict';

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var ObjectId = require('mongodb').ObjectId;

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

var findDocumentById = function(db, matchId, callback) {
  // Get the document from songs collection
  var collection = db.collection('songs');
  if (matchId != undefined && matchId.length > 0 ) {
      //var searchPhrase = '/.*'+match+'.*/'; ///.*m.*/
      var searchPhrase = '"'+matchId+'"';
      console.log("searching by matchId: "+matchId);
      var o_id = new ObjectId(matchId);
      console.log("GONNA try for doctest");
    var docTest = collection.find({_id : "5834f96c833415c6331482e0"});
    //var docTest = collection.find({_id : searchPhrase});
    //console.log("docTest is NOW: "+docTest[0].title);
      if (docTest == null || docTest == undefined) {
          console.log("docs is undefined, SORRY!!!!!!");
      } else {
          console.log("docs is NOT undefined, YEAHHHH!!!!!!");
          console.log("LENGTH: " + docTest.length);
          
          for (var i = 0, len = docTest.length; i < len; i++) {
              console.log("song title: "+docTest[i].title);
          }
      }
      
 //    collection.find({"_id": o_id}, function(err, doc) {
    collection.find({_id : searchPhrase}, function(err, docs) {
        assert.equal(err, null);
        console.log("Found the following record");
        //console.log("title IS "+ docs.title);
        callback(docs);
      });
  } else {
      console.log("empty search happening");
      collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
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
    
 app.get('/song/showone', function (req, res) {
    console.log("gonna search songs");
     
    //var match = req.body.songid;
    var song = req;
    var match = "";
    var songid = song.query.songid;
    console.log("------------------------");
    console.log("songid is: "+songid);
    console.log("------------------------");
    if (songid != undefined) {
      match = songid;
    }  
    
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
      findDocumentById(db, match, function(docs) { 
            console.log("INSIDE search for match for "+match);
            db.close();
          
            console.log("size ? of song listing: "+docs);
            if (docs == null || docs == undefined) {
                res.render('pages/songSelected', { songs: [] });
                    //title : "Database Trouble, Sorry.", chorus : "", body : "", credits: ""});
            } else {
                console.log("use the first element of the result, which just 1 anyway")
                //var doc = docs[1];
                
                res.render('pages/songSelected', { songs: docs });
                    //title : doc.title, chorus : doc.chorus, body : doc.body, credits: doc.credits });
                
            }
      });         
         
    });
     
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