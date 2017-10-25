var newsModel = require('../models/news-model')

var newsCtrl = {
  getAllSegment: function() {
    return new Promise(function(resolveQuery, rejectQuery) {
      Promise.all([newsModel.getUnlabelledSegment(), newsModel.getProcessingSegment(), newsModel.getLabelledSegment()]).then(function(queryResult) {
        resolveQuery({
          unlabelled: queryResult[0],
          processing: queryResult[1],
          labelled: queryResult[2]
        });
      }).catch(function(queryError) {
        rejectQuery(queryError.toString());
      });
    });
  },
  // getAllPlatform: function() {
  //   return new Promise(function(resolveQuery, rejectQuery){
  //     Promise.all([news.Model.getUnlabelledPlatform()])
  //   });
  // }
};

module.exports = newsCtrl;
