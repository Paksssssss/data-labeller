var newsModel = require('./news-model')

var socketModel = function (socket) {
  var startLabelArticle = function(news_id){
    newsModel.setLabelSegment(news_id).then(function(res){
      socket.emit('db updated', true);
      socket.broadcast.emit('db updated', true);
    }).catch(function(err) {

      console.log(err.toString());

    });
  };
  var setLabelArticle = function(label_info){
    console.log("segment: "+label_info['segment'])
    newsModel.setLabelSegment(label_info).then(function(res){
      socket.emit('db updated', true);
      socket.broadcast.emit('db updated', true);
    }).catch(function(err) {

      console.log(err.toString());

    });
  };

  var cancelLabelArticle = function(news_id){
    newsModel.cancelLabelSegment(news_id).then(function(res){
      console.log(news_id)
      socket.emit('db updated', true);
      socket.broadcast.emit('db updated', true);
    }).catch(function(err) {

      console.log(err.toString());
    });
  };

  socket.on('unlabelled clicked', startLabelArticle);
  socket.on('cancel label', cancelLabelArticle);
  socket.on('label set', setLabelArticle);
};

module.exports = socketModel
