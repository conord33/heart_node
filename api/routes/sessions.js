var router = require('express').Router(),
  _ = require('lodash'),
  helpers = require('../helpers');

// General sessions endpoint with paging
router.get('/', function (req, res) {
	// get paging params
	var limit = req.query.limit || 20;
	var offset = req.query.offset || 0;

	// set the sql query
	var sql = 'SELECT s.id, min(s.user_id) as user_id, min(s.created_at) as created_at, min(s.duration) as duration, sum(r.bpm * r.duration) / sum(r.duration) as average, max(r.bpm) as max, min(r.bpm) as min FROM (SELECT * FROM sessions ORDER BY created_at DESC LIMIT ' + limit + ' OFFSET ' + offset + ') s, recordings r WHERE s.id = r.session_id GROUP BY s.id ORDER BY created_at DESC';

	// make query
    helpers.pgquery(sql, function (err, result) {
	    if (err) {
	    	console.log(err);
	    }

	    // convert strings to floats, not sure why pg is returing strings
	    _.each(result.rows, function (row) {
	    	row.average = parseFloat(row.average);
	    });

	    res.json(result.rows);
	});
});

// Get stats on all of the sessions
router.get('/all', function (req, res) {
	// set up query
	var sql = 'SELECT sum(bpm * duration) / sum(duration) as average, max(bpm) as max, min(bpm) as min FROM recordings';

	// make query
	helpers.pgquery(sql, function (err, result) {
	    if (err) {
	    	console.log(err);
	    }

	    // convert string values to floats
	    result.rows[0].average = parseFloat(result.rows[0].average);

	    res.json(result.rows[0]);
	});
});

// Get info on specific session
router.get('/:id', function (req, res) {
	var id = req.params.id;

	// set up query
	var sql = 
	'SELECT * '+
	'FROM '+
	  '(SELECT '+
	  	'created_at as sc_time, '+
	  	'duration as s_duration, '+
	  	'user_id '+
	  'FROM sessions '+
	  'WHERE id = ' + id +') s, '+
      '(SELECT * '+
      'FROM users '+
      'WHERE id = '+
        '(SELECT user_id '+
        'FROM sessions '+
        'WHERE id = ' + id +')) u, '+
      '(SELECT * '+
      'FROM recordings '+
      'WHERE session_id = ' + id + ') r '+
      'ORDER BY r.start_time';

    // make query
	helpers.pgquery(sql, function (err, result) {
	    if (err) {
	    	console.log(err);
	    }

	    // create base oject for response
	    var json = {
	    	id: id,
	    	user_id: result.rows[0].user_id,
	    	min: _.min(result.rows, 'bpm').bpm,
	    	max: _.max(result.rows, 'bpm').bpm,
	    	average: _.sum(result.rows, 'bpm') / result.rows.length,
	    	duration: result.rows[0].s_duration,
	    	created_at: result.rows[0].sc_time,
	    	zones: {
		    	1: {
		    		min: result.rows[0].bpm_z1_min,
		    		max: result.rows[0].bpm_z1_max,
		    		duration: 0
		    	},
		    	2: {
		    		min: result.rows[0].bpm_z2_min,
		    		max: result.rows[0].bpm_z2_max,
		    		duration: 0
		    	},
		    	3: {
		    		min: result.rows[0].bpm_z3_min,
		    		max: result.rows[0].bpm_z3_max,
		    		duration: 0
		    	},
		    	4: {
		    		min: result.rows[0].bpm_z4_min,
		    		max: result.rows[0].bpm_z4_max,
		    		duration: 0
		    	}
		    },
	    	data_points: []
	    };

	    // fill in data for all of the data points
	    var row_duration;
	    _.each(result.rows, function (row) {
	    	row_duration = parseInt(row.duration);

	    	json.data_points.push({
	    		start_time: row.start_time,
	    		bpm: row.bpm,
	    		duration: row_duration
	    	});

	    	_.each(json.zones, function (zone) {
	    		if (row.bpm <= zone.max && row.bpm >= zone.min) {
	    			zone.duration += row_duration;
	    			return;
	    		}
	    	});
	    });

	    res.json(json);
	});
});

module.exports = router;
