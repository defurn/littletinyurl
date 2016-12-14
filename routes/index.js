var express = require('express');
var router = express.Router();
var transcodingKeys = {
  0:"0", 1:"1", 2:"2", 3:"3", 4:"4", 5:"5", 6:"6",
}
var baseURL = "http://localhost:3000/r/"

//just need to do the magic for making the correct new URL...
function generateURL(id){
  return baseURL += id;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 'title': 'littletinyurl' });
});
/*GET for redrecting short urls to original destinations */
router.get('/r/:id', function(req, res){
  var id = baseURL + req.params.id;
  req.db.connect(req.dburl, function(err, dbs){
    dbs.collection('urls').findOne({"newURL":id}, function(err, doc){
      //var redirectURL = doc.originalURL;
        res.redirect("http://" + doc.originalURL);//redirect?? doesn't work..
        dbs.close();

    })
  })
})

/* PUT url and get new url */
router.post('/getURL', function(req, res){
  req.db.connect(req.dburl, function(err, dbs){
    var collection = dbs.collection('urls');
    var id = req.body.id;
    var newURL = generateURL(id);
    collection.insert({"originalURL":id, "newURL":newURL}, function(err, doc){
      //console.log(req.body.id);
      res.render('url', {
        "newURL": newURL
      });
      dbs.close();

    });
  });
})
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
module.exports = router;
