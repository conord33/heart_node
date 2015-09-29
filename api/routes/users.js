var router = require('express').Router(),
  _ = require('lodash'),
  helpers = require('../helpers');

// get data on all users
router.get('/all', function (req, res) {
	// set up query
	var sql = 
	'SELECT '+
	  'sum(total_duration) as total_duration, '+
	  '(sum(z1_duration) / sum(total_duration)) as z1_duration, '+
	  '(sum(z2_duration) / sum(total_duration)) as z2_duration, '+
	  '(sum(z3_duration) / sum(total_duration)) as z3_duration, '+
	  '(sum(z4_duration) / sum(total_duration)) as z4_duration '+
	'FROM '+ 
	  '(SELECT '+
	  	'sum(CASE WHEN bpm >= z1mi AND bpm <= z1ma THEN duration ELSE 0 END) as z1_duration, '+
	  	'sum(CASE WHEN bpm >= z2mi AND bpm <= z2ma THEN duration ELSE 0 END) as z2_duration, '+
	  	'sum(CASE WHEN bpm >= z3mi AND bpm <= z3ma THEN duration ELSE 0 END) as z3_duration, '+
	  	'sum(CASE WHEN bpm >= z4mi AND bpm <= z4ma THEN duration ELSE 0 END) as z4_duration, '+
	  	'sum(r.duration) as total_duration '+
	  'FROM '+
	    '(SELECT '+
	    	'u.bpm_z1_min as z1mi, '+
	    	'u.bpm_z1_max as z1ma, '+
	    	'u.bpm_z2_min as z2mi, '+
	    	'u.bpm_z2_max as z2ma, '+
	    	'u.bpm_z3_min as z3mi, '+
	    	'u.bpm_z3_max as z3ma, '+
	    	'u.bpm_z4_min as z4mi, '+
	    	'u.bpm_z4_max as z4ma, '+
	    	'u.id as uid, '+
	    	's.id as sid '+
	    'FROM '+
	      'users u, '+
	      'sessions s '+
	    'WHERE '+
	      'u.id = s.user_id) us, '+
      'recordings r '+ 
    'WHERE '+
      'us.sid = r.session_id GROUP BY uid) f';

	// make query
	helpers.pgquery(sql, function (err, result) {
	    if (err) {
	    	console.log(err);
	    }

	    // convert string values to floats
	    _.each(result.rows[0], function (v, k) {
	    	result.rows[0][k] = parseFloat(v);
	    });

	    res.json(result.rows[0]);
	});
});



module.exports = router;
