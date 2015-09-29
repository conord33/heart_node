CREATE TABLE users(
	id INTEGER PRIMARY KEY,
	created_at TIMESTAMP,
	user_name VARCHAR(40),
	gender VARCHAR(40),
	age INTEGER,
	bpm_z1_min INTEGER,
	bpm_z1_max INTEGER,
	bpm_z2_min INTEGER,
	bpm_z2_max INTEGER,
	bpm_z3_min INTEGER,
	bpm_z3_max INTEGER,
	bpm_z4_min INTEGER,
	bpm_z4_max INTEGER
);

CREATE TABLE sessions(
	id INTEGER PRIMARY KEY,
	user_id INTEGER references users(id),
	created_at TIMESTAMP,
	duration INTEGER
);

CREATE INDEX ON sessions (user_id);
CREATE INDEX ON sessions (created_at);


CREATE TABLE recordings(
	session_id INTEGER references sessions(id),
	bpm INTEGER,
	start_time TIMESTAMP, 
	end_time TIMESTAMP,
	duration DECIMAL(6,1)
);

CREATE INDEX ON recordings (session_id);
