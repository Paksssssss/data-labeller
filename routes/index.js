var express = require('express');
var router = express.Router();

var newsCtrl = require('../controller/news-controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  newsCtrl.getAllSegment().then(function(queryResult){
    // console.log(baseUrl);
    console.log(queryResult['unlabelled'].length)
    res.render('index',queryResult);
  }).catch(function(queryError){
    console.log(queryError.toString());
  });
});

router.get('/ajax-call-segment', function(req, res, next){
  newsCtrl.getAllSegment().then(function(queryResult){
    console.log(queryResult['unlabelled'].length)
    res.send(queryResult);
  }).catch(function(queryError){
    console.log(queryError.toString());
  });
});

router.get('/ajax-call-platform', function(req, res, next){
  newsCtrl.getAllPlatform().then(function(queryResult){
    console.log(queryResult['unlabelled'].length)
    res.send(queryResult);
  }).catch(function(queryError){
    console.log(queryError.toString());
  });
});


router.get('/platform',function(req,res,next){
  newsCtrl.getAllPlatform().then(function(queryResult){
    // console.log(baseUrl);
    console.log("im at platform " + queryResult['unlabelled'].length)
    res.render('platform',queryResult);
  }).catch(function(queryError){
    console.log(queryError.toString());
  });
});

module.exports = router;