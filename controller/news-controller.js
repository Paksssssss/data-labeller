var newsModel = require('../models/news-model')

var newsCtrl = {
    getAllSegment: function() {
        return new Promise(function(resolveQuery, rejectQuery) {
            Promise.all([newsModel.getUnlabelled("segment"), newsModel.getProcessing("segment"), newsModel.getLabelled("segment")]).then(function(queryResult) {
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
    getAllPlatform: function() {
        return new Promise(function(resolveQuery, rejectQuery) {
            Promise.all([newsModel.getUnlabelled("platform"), newsModel.getProcessing("platform"), newsModel.getLabelled("platform")]).then(function(queryResult) {
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
    getSegmentCount: function() {
        return new Promise(function(resolveQuery, rejectQuery){
            newsModel.getCount().then(function(res){
                resolveQuery(res);
            }).catch(function(err){
                rejectQuery(err.toString());
            });
        });
    }
};

module.exports = newsCtrl;
