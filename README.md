# Heart Rate Data API
Ansible is used to provision a vagrant box to run `x` number of node processes (currently 1)
load balanced by nginx and managed by supervisor.

Postgres is used as the database and it is populated by Ansible during the provisioning of the 
vagrant box.

## Running the API
Ansible must be installed on the host machine prior to running `vagrant up`.

The API should start running on port `80` after `vagrant up` is executed.  It should be running on
the local ip `10.33.33.30`.  This can be configured in the top of the `Vagrantfile`.

#### Running the tests
The tests can be run by sshing into the vagrant box `vagrant ssh`.
Then running `npm test` from the api directory `/var/www/api`.

## Heart Rate API
The API consists of the four endpoints below.

### Endpoints

#### GET /sessions?offset=<int>&limit=<int>
This endpoint allows the user to page through session data ordered by the most recent session. It
returns an array of object with high level data about a session.

ex: response
```
[
  {
  	"id":51576,                               // id of the session
  	"user_id":9937,                           // id of user who created the session
	"created_at":"2013-05-16T15:44:52.000Z",  // time the session was created
	"duration":2582,                          // length of session in seconds  
	"average":156.67680608365018,             // average bpm durring session
	"max":183,                                // max bpm durring session
	"min":92                                  // min bpm durring session
  }
]
```

#### GET /sessions/:id
This endpoint returns a more detailed session object, containing info that describes the 
change in heart rate over time during the session.

ex: response
```
{
	"id":"51573",                              // id of the session
  	"user_id":9937,                            // id of user who created the session
	"created_at":"2013-05-16T15:44:52.000Z",   // time the session was created
	"duration":2582,                           // length of session in seconds  
	"average":156.67680608365018,              // average bpm durring session
	"max":183,                                 // max bpm durring session
	"min":92                                   // min bpm durring session
	"zones": {                                 // the 4 different heart rate zones of the user
	  "1": {                                      // they are labeled 1 - 4, there are always 4 
	    "min":126,                                // minimum bpm for this zone
	    "max":140,                                // maximum bpm for this zone
	    "duration":43                             // time in seconds spent in this zone 
	  }
	},
	"data_points":[                            // times series array of bpm measurements
	  {
	    "start_time":"2013-05-16T15:44:52.000Z",  // the starting time of the measurement
	    "bpm":93,                                 // the bpm during this measurement
	    "duration":5                              // consecutive time in seconds at this bpm
	  }
	]
}
```

#### GET /sessions/all
This endpoint allows the user get aggregate data about all of the sessions.

ex: response
```
{
	"average": 166.32000286322506,               // average bpm accross all sessions
	"max": 203,                                  // maximum bpm accross all sessions
	"min": 76                                    // minimum bpm accross all sessions
}
```

#### GET /users/all
This endpoint allows the user get aggregate data about all of the users.

ex: response
```
{
	"total_duration": 68999117,               // total time in seconds measured
	"z1_duration": 0.019710266727036522,      // percentage of time spent in each zone over all users
	"z2_duration": 0.26456729873804036,
	"z3_duration": 0.4073999236830813,
	"z4_duration": 0.2355807683741808
}
```



