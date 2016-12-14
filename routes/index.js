var express = require('express')
var router = express.Router()
var transcodingKeys = {
  0:"0", 1:"1", 2:"2", 3:"3", 4:"4", 5:"5", 6:"6",
}
var baseURL = "https://littletinyurl.herokuapp.com/r/"
var newURL


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 'title': 'littletinyurl' })
})


/*GET for redrecting short urls to original destinations */
router.get('/r/:id', function(req, res){
  var id = baseURL + req.params.id;
  req.db.connect(req.dburl, function(err, dbs){
    dbs.collection('urls').findOne({"newURL":id}, function(err, doc){
      //var redirectURL = doc.originalURL;
        res.redirect("http://" + doc.originalURL)
        dbs.close();

    })
  })
})


/* POST -- generate new URL, put it in the db, display new url */
router.post('/getURL',

function(req, res, next){
  req.db.connect(req.dburl, function(err, dbs){
    var counter = dbs.collection('counter')
    counter.findAndModify({_id:"sitename"},{},{$inc: {seq:1}}, {new:true}, function(err,doc){
        newURL = baseURL + doc.value.seq
        console.log("url = " + newURL)
      })
    next()
  })
},

function(req, res){
  req.db.connect(req.dburl, function(err, dbs){
    var collection = dbs.collection('urls')
    var id = req.body.id
    //at this point newURL is still undefined, how to make sure generateURL gets called before this point?
    var newDoc = {"originalURL":id, "newURL":newURL}
    console.log(newDoc)

    collection.insertOne(newDoc, function(err, doc){
        res.render('url', {
          "newURL": newURL
      })
      dbs.close()
    })
  })
})
//this is not working, does not return the newURL


/* GET short url */
// router.get('/newURL', function(req, res){
//   req.db.connect(req.dburl, function(err, dbs){
//     var collection = dbs.collection('urls');
//     var id = req.query.id;
//     collection.findOne({"originalURL":id}, function(err, doc){
//       console.log(doc);
//       res.render('url', {
//         "newURL": doc.newURL
//       });
//       dbs.close();
//     });
//
//   });
//
// });
module.exports = router
