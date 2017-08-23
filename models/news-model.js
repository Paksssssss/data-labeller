var mysql = require('../config/mysql');

var query1 = 'SELECT news_id, news_title,news_date, news_content, news_image, news_url FROM news WHERE status=? ORDER BY news_id ASC LIMIT 4';
var query2 = 'SELECT news_id, news_title,news_date, news_content, news_image, news_url FROM news WHERE status=? ORDER BY news_id DESC LIMIT 4';
var updateQuery = 'UPDATE news SET status=? WHERE news_id=?'
var newsModel = {
  getUnlabelled: function() {
    return new Promise(function(resolveQuery, rejectQuery){
      mysql.query(query1,[0], function(error, results, fields){
        if(error){
          console.log(error.toString());
          rejectQuery(error.toString());
        }
        resolveQuery(results);
      });
    });
  },
  getProcessing: function() {
    return new Promise(function(resolveQuery, rejectQuery){
      mysql.query(query2, [1], function(error, results,fields){
        if(error){
          console.log(error.toString());
          rejectQuery(error.toString());
        }
        resolveQuery(results);
      });
    });
  },
  getLabelled: function() {
    return new Promise(function(resolveQuery, rejectQuery){
      mysql.query(query2, [2], function(error, results,fields){
        if(error){
          console.log(error.toString());
          rejectQuery(error.toString());
        }
        resolveQuery(results);
      });
    });
  },
  startLabel: function(news_id){
    return new Promise(function(resolveUpdate, rejectUpdate){
      mysql.query(updateQuery, [1,news_id], function(error, results, fields){
        if(error){
          console.log(error.toString());
          rejectUpdate(error.toString());
        }
        console.log('in start Label')
        resolveUpdate(results)
      });
    });
  },
  setLabel: function(news_id){
    return new Promise(function(resolveUpdate, rejectUpdate){
      mysql.query(updateQuery, [2,news_id],function(error,results,fields){
        if(error){
          console.log(error.toString());
          rejectUpdate(error.toString());
        }
        resolveUpdate(results)
      });
    });
  },
  cancelLabel: function(news_id){
    console.log(news_id)
    return new Promise(function(resolveUpdate, rejectUpdate){
      mysql.query(updateQuery, [0,news_id],function(error,results,fields){
        if(error){
          console.log(error.toString());
          rejectUpdate(error.toString());
        }
        resolveUpdate(results)
      });
    });
  }
};

module.exports = newsModel;
