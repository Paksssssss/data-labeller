var mysql = require('mysql');

var mysqlConn = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'whatoplay_ml'
});

mysqlConn.connect(function(err) {

	if(err) {

		console.error('error connecting: ' + err.stack);
    return;

	}

	console.log('DB connected');

});

module.exports = mysqlConn;
