var mysql = require('../config/mysql');

var tweetQuery1 = 'SELECT tweet_id, tweet_text, tweet_pos FROM tweets WHERE label_status=? ORDER BY id DESC LIMIT 10'
var tweetQuery2 = 'SELECT tweet_id, tweet_text, tweet_pos, ner_labels FROM tweets WHERE label_status=2 ORDER BY date_labelled DESC LIMIT 10'
var updateQuery = 'UPDATE tweets SET label_status=? WHERE tweet_id=?'
var setLabelQuery = 'UPDATE tweets SET label_status=2, ner_labels=?, date_labelled=? WHERE tweet_id=?'
var removeTweetQuery = 'DELETE FROM tweets where tweet_id=?'
var tweetModel = {
  getUnlabelled: function() {
    return new Promise(function(resolveQuery, rejectQuery){
      mysql.query(tweetQuery1,[0],function(error,results,fields) {
        if (error) {
          console.log("Error in getting Unlabelled TWEETS!");
          console.log(error.toString());
          rejectQuery(error.toString());
        }
        resolveQuery(results)
      });
    });
  },
  getProcessing: function() {
    return new Promise(function(resolveQuery, rejectQuery){
      mysql.query(tweetQuery1,[1],function(error,results,fields) {
        if (error) {
          console.log("Error in getting Processing TWEETS!");
          console.log(error.toString());
          rejectQuery(error.toString());
        }
        resolveQuery(results)
      });
    });
  },
  getLabelled: function() {
    return new Promise(function(resolveQuery, rejectQuery){
      mysql.query(tweetQuery2,function(error,results,fields) {
        if (error) {
          console.log("Error in getting Labelled TWEETS!");
          console.log(error.toString());
          rejectQuery(error.toString());
        }
        resolveQuery(results)
      });
    });
  },
  updateStatus: function(tweet_info) {
    return new Promise(function(resolveQuery,rejectQuery){
      mysql.query(updateQuery,[tweet_info['status'],tweet_info['id']],function(error,results,fields){
        if (error){
          console.log("Error in updating label status!");
          console.log(error.toString());
          rejectQuery(error.toString());
        }
        resolveQuery(results);
      });
    });
  },
  setLabel: function(tweet_info) {
    return new Promise(function(resolveQuery, rejectQuery){
      mysql.query(setLabelQuery,[tweet_info['ne_tags'],tweet_info['timestamp'],tweet_info['id']], function(error,results,fields){
        if (error){
          console.log('Error in setting NE label');
          console.log(error.toString());
          rejectQuery(error.toString());
        }
        resolveQuery(results);
      });
    });
  },
  removeTweet: function(tweet_id){
    return new Promise(function(resolveQuery, rejectQuery){
      mysql.query(removeTweetQuery,[tweet_id],function(error,results,fields){
        if(error){
          console.log('Error in REMOVING tweet');
          console.log(error.toString());
          rejectQuery(error.toString());
        }
      });
    });
  }
}

module.exports = tweetModel;
