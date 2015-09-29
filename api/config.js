module.exports = {
	// DB URI
	postgres: {
		uri: process.env.DATABASE_URI || 'postgres://node:nodeapppassword@localhost:5432/nodeapp'
	},
	
	// Port the server will run on
	port: process.env.PORT || 8080,

	// URL to run integration tests against
	test_url: process.env.TEST_URL || 'http://localhost'
};