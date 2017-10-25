var mysql = require('../config/mysql');

var segmentQuery1 = 'SELECT news_id, news_title,news_date, news_content, news_image, news_url FROM news WHERE s_status=? ORDER BY news_id ASC LIMIT 4';
var segmentQuery2 = 'SELECT news_id, news_title,news_date, news_content, news_image, news_url, segment_label FROM news WHERE s_status=? ORDER BY s_labelled_date DESC LIMIT 4';
var segmentUpdateQuery = 'UPDATE news SET s_status=? WHERE news_id=?';
var segmentSetLabelQuery = 'UPDATE news SET s_status=?, segment_label = ?, s_labelled_date = TIMESTAMP(?) WHERE news_id=?';
var platformQuery1 = 'SELECT news_id, news_title,news_date, news_content, news_image, news_url FROM news WHERE p_status=? ORDER BY news_id ASC LIMIT 4';
var platformQuery2 = 'SELECT news_id, news_title,news_date, news_content, news_image, news_url, segment_label FROM news WHERE p_status=? ORDER BY news_id DESC LIMIT 4';
var platformUpdateQuery = 'UPDATE news SET p_status=? WHERE news_id=?';
var platformSetLabelQuery = 'UPDATE news SET p_status=?, platform_label=? WHERE news_id=?';

var newsModel = {
  getUnlabelledSegment: function() {
    return new Promise(function(resolveQuery, rejectQuery) {
      mysql.query(segmentQuery1, [0], function(error, results, fields) {
        if (error) {
          console.log("ERROR IN GET UNLABELLED")
          console.log(error.toString());
          rejectQuery(error.toString());
        }
        resolveQuery(results);
      });
    });
  },
  getProcessingSegment: function() {
    return new Promise(function(resolveQuery, rejectQuery) {
      mysql.query(segmentQuery2, [1], function(error, results, fields) {
        if (error) {
          console.log(error.toString());
          rejectQuery(error.toString());
        }
        resolveQuery(results);
      });
    });
  },
  getLabelledSegment: function() {
    return new Promise(function(resolveQuery, rejectQuery) {
      mysql.query(segmentQuery2, [2], function(error, results, fields) {
        if (error) {
          console.log(error.toString());
          rejectQuery(error.toString());
        }
        resolveQuery(results);
      });
    });
  },
  startLabelSegment: function(news_id) {
    return new Promise(function(resolveUpdate, rejectUpdate) {
      mysql.query(segmentUpdateQuery, [1, news_id], function(error, results, fields) {
        if (error) {
          console.log(error.toString());
          rejectUpdate(error.toString());
        }
        console.log('in start Label')
        resolveUpdate(results)
      });
    });
  },
  setLabelSegment: function(label_info) {
    return new Promise(function(resolveUpdate, rejectUpdate) {
      // console.log('timestamp:   ' + label_info['timestamp'])
      mysql.query(segmentSetLabelQuery, [2, label_info['segment'], label_info['timestamp'], label_info['id']], function(error, results, fields) {
        if (error) {
          console.log(error.toString());
          rejectUpdate(error.toString());
        }
        resolveUpdate(results)
      });
    });
  },
  cancelLabelSegment: function(news_id) {
    console.log(news_id)
    return new Promise(function(resolveUpdate, rejectUpdate) {
      mysql.query(segmentUpdateQuery, [0, news_id], function(error, results, fields) {
        if (error) {
          console.log(error.toString());
          rejectUpdate(error.toString());
        }
        resolveUpdate(results)
      });
    });
  }
};

module.exports = newsModel;
