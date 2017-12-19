var tweetModel = require('../models/tweet-model')

var tweetCtrl = {
  getAllTweets: function(){
    return new Promise(function(resolveQuery, rejectQuery) {
      Promise.all([tweetModel.getUnlabelled(), tweetModel.getProcessing(), tweetModel.getLabelled()]).then(function(queryResult) {
        resolveQuery({
          unlabelled: queryResult[0],
          processing: queryResult[1],
          labelled: queryResult[2]
        });
      }).catch(function(queryError) {
        rejectQuery(queryError.toString());
      });
    });
  }
};


module.exports = tweetCtrl;
