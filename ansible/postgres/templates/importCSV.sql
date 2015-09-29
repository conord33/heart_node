COPY users FROM '/tmp/users.csv' DELIMITER ',' CSV HEADER;
COPY sessions FROM '/tmp/hrm_sessions.csv' DELIMITER ',' CSV HEADER;
COPY recordings FROM '/tmp/hrm_data_points.csv' DELIMITER ',' CSV HEADER;