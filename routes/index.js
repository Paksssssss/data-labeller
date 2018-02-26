var express = require('express');
var router = express.Router();

var newsCtrl = require('../controller/news-controller');
var tweetCtrl = require('../controller/tweet-controller');

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

router.get('/tweets',function(req,res,next){
  tweetCtrl.getAllTweets().then(function(queryResult){
    res.render('tweets',queryResult)
  }).catch(function(queryError){
    console.log(queryError.toString());
  });
});

router.get('/ajax-call-tweets',function(req, res, next){
  tweetCtrl.getAllTweets().then(function(queryResult){
    console.log(queryResult['unlabelled'].length)
    res.send(queryResult);
  }).catch(function(queryError){
    console.log(queryError.toString());
  });
});

router.get('/counts', function(req, res, next){
    console.log("getCounts")
    Promise.all([tweetCtrl.getTweetCount(),newsCtrl.getSegmentCount()]).then(function(queryResult){
        counts = {
            'tweet' : queryResult[0],
            'segment' : queryResult[1]
        }
        console.log("Show Counts  " + counts.toString())
        res.send(counts)
    }).catch(function(queryError){
        console.log(queryError.toString())
    });
});

module.exports = router;
