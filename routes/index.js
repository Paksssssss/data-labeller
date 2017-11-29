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

router.get('/ajax-call', function(req, res, next){
  newsCtrl.getAllSegment().then(function(queryResult){
    console.log(queryResult['unlabelled'].length)
    res.send(queryResult);
  }).catch(function(queryError){
    console.log(queryError.toString());
  });
});

router.get('/platform',function(req,res,next){
  // console.log(router.stack)
  sample = {'item':'blah'};
  res.render('platform',sample);
});

module.exports = router;
