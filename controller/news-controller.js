var newsModel = require('../models/news-model')

var newsCtrl = {
  getAllNews: function() {
    return new Promise(function(resolveQuery, rejectQuery) {
      Promise.all([newsModel.getUnlabelled(), newsModel.getProcessing(), newsModel.getLabelled()]).then(function(queryResult) {
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

module.exports = newsCtrl;
