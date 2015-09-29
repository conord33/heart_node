var config = require('./config'),
	express = require('express'),
	routes = require('./routes'),
	app = express();

// Add routes to app
app.use('/sessions', routes.sessions);
app.use('/users', routes.users);

// Set up port
app.listen(config.port);

console.log('middleware running on port:', config.port);
