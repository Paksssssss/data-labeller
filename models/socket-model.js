var newsModel = require('./news-model');
var tweetModel = require('./tweet-model');

var socketModel = function (socket) {
  var startLabelArticle = function(news_details){
    newsModel.startLabel(news_details['id'],news_details['type']).then(function(res){
      socket.emit('db updated', news_details['type']);
      socket.broadcast.emit('db updated', news_details['type']);
    }).catch(function(err) {

      console.log(err.toString());

    });
  };
  var setLabelArticle = function(label_info){
    console.log("segment: "+label_info['label'])
    newsModel.setLabel(label_info).then(function(res){
      socket.emit('db updated', label_info['type']);
      socket.broadcast.emit('db updated', label_info['type']);
    }).catch(function(err) {

      console.log(err.toString());

    });
  };

  var cancelLabelArticle = function(news_details){
    newsModel.cancelLabel(news_details["id"],news_details["type"]).then(function(res){
      console.log(news_details["id"],news_details["type"])
      socket.emit('db updated', news_details['type']);
      socket.broadcast.emit('db updated', news_details['type']);
    }).catch(function(err) {

      console.log(err.toString());
    });
  };

  var updateTweetStatus = function(tweet_info){
    tweetModel.updateStatus(tweet_info).then(function(res){
      console.log("Labelling Tweet " + tweet_info['id'])
      socket.emit('update list');
      socket.broadcast.emit('update list');
    }).catch(function(err){
      console.log(err.toString());
    });

  };

  var setTweetLabel = function(tweet_info){
    tweetModel.setLabel(tweet_info).then(function(res){
      console.log("Tweet Labelled");
      socket.emit('update list');
      socket.broadcast.emit('update list')
    }).catch(function(err){
      console.log(err.toString());
    });
  };

  var removeTweet = function(tweet_id){
    tweetModel.removeTweet(tweet_id).then(function(res){
      console.log("Tweet Removed");
      socket.emit('update list');
      socket.broadcast.emit('update list')
    })
  };

  socket.on('remove tweet', removeTweet);
  socket.on('label tweet', setTweetLabel);
  socket.on('tweet clicked', updateTweetStatus);
  socket.on('tweet cancelled', updateTweetStatus)
  socket.on('unlabelled clicked', startLabelArticle);
  socket.on('cancel label', cancelLabelArticle);
  socket.on('label set', setLabelArticle);
};

module.exports = socketModel;
