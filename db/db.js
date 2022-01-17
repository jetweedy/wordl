/*
LOCAL .env:
CLEARDB_DATABASE_URL=mysql://nonnychat:nonnychat@localhost/nonnychat?reconnect=true
*/
var mysql = require('mysql');
require('dotenv').config()
const {ConnectionString} = require('connection-string');
var conndeets = new ConnectionString(process.env.CLEARDB_DATABASE_URL);

var pool  = mysql.createPool({
	connectionLimit : 10,
	host     : conndeets.hostname,
	user     : conndeets.user,
	password : conndeets.password,
	database : conndeets.path && conndeets.path[0]
});

var db = {


	clean: (x) => {
		if (typeof x == "string") {
			x = x.replace(/'/g, '&apos;');
			x = x.replace(/\t/g, ' ');			
		}
		return x;
	}

	,

	query: (query, callback) => {

		pool.getConnection(function(err, connection) {
		  if (err) throw err; // not connected!
		  // Use the connection
		  connection.query(query, function (error, results, fields) {
		    // When done with the connection, release it.
		    connection.release();
		    // Handle error after the release.
		    if (error) throw error;
		    // Don't use the connection here, it has been returned to the pool.
		  	try {
		  		callback(error, results, fields);
		  	} catch(er) {
		  		console.log("Caught Error: ", er);
		  	}
		  });
		});

/*
		var connection = mysql.createConnection({
		  host     : conndeets.hostname,
		  user     : conndeets.user,
		  password : conndeets.password,
		  database : conndeets.path && conndeets.path[0]
		});
		connection.connect();
//		connection.query(query, function (error, results, fields) {
//			//
//		});
		connection.query(query, callback);
		connection.end();
*/

	}
	,
	test: () => {
		console.log("test");
	}
}

module.exports = db;
