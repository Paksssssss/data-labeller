var newsModel = require('./news-model')

var socketModel = function (socket) {
  var startLabelArticle = function(news_id){
    newsModel.startLabel(news_id).then(function(res){
      socket.emit('db updated', true);
      socket.broadcast.emit('db updated', true);
    }).catch(function(err) {

      console.log(err.toString());

    });
  };
  var setLabelArticle = function(news_id){
    newsModel.setLabel(news_id).then(function(res){
      socket.sockets.emit('db updated', true);
    }).catch(function(err) {

      console.log(err.toString());

    });
  };

  var cancelLabelArticle = function(news_id){
    newsModel.cancelLabel(news_id).then(function(res){
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
