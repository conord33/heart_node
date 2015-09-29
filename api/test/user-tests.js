var should = require('chai').should(),
	config = require('../config'),
	supertest = require('supertest');


describe('Users', function () {

	var sessionId;
	var api = supertest(config.test_url);
	
	this.timeout(90000);

	describe('GET /users/all', function () {
		it('should return stats of all users', function (done) {
			api.get('/users/all')
			    .expect('Content-Type', /json/)
			    .expect(200)
			    .end(function (err, res) {
			      res.body.total_duration.should.not.equal(0);
			      res.body.z1_duration_duration.should.not.equal(0);
			      res.body.z2_duration.should.not.equal(0);
			      res.body.z3_duration.should.not.equal(0);
			      res.body.z4_duration.should.not.equal(0);
			      done();
			    });
		});
	});

});