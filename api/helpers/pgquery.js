var pg = require('pg'),
  _ = require('lodash'),
  config = require('../config');

// General helper function to handle postgres queries
module.exports = function (sql, cb) {
	pg.connect(config.postgres.uri, function(err, client, done) {
	  if(err) {
	    return cb(err);
	  }

	  client.query(sql, function(err, result) {
	    if (err) {
	    	return cb(err);
	    }

	    done();

	    cb(null, result);
	  });
	});
}