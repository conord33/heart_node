var should = require('chai').should(),
	config = require('../config'),
	supertest = require('supertest');


describe('Sessions', function () {

	var sessionId;
	var api = supertest(config.test_url);
	
	this.timeout(90000);

	describe('GET /sessions', function () {
		it('should return 20 sessions', function (done) {
			api.get('/sessions')
			    .expect('Content-Type', /json/)
			    .expect(200)
			    .end(function (err, res) {
			      res.body.length.should.equal(20);	
			      sessionId = res.body[3].id;
			      done();
			    });
		});

		it('should return 10 sessions starting with the 3rd one from before', function (done) {
			api.get('/sessions?offset=2&limit=10')
			    .expect('Content-Type', /json/)
			    .expect(200)
			    .end(function (err, res) {
			      res.body.length.should.equal(10);	
			      res.body[0].id.should.equal(sessionId);
			      done();
			    });
		});
	});

	describe('GET /sessions/:id', function () {
		it('should return session object', function (done) {
			api.get('/sessions/' + sessionId)
			    .expect('Content-Type', /json/)
			    .expect(200)
			    .end(function (err, res) {
			      done();
			    });
		});
	});

	describe('GET /sessions/all', function () {
		it('should return stats of all sessions', function (done) {
			api.get('/sessions/all')
			    .expect('Content-Type', /json/)
			    .expect(200)
			    .end(function (err, res) {
			      res.body.average.should.be.lt(res.body.max);
			      res.body.average.should.be.gt(res.body.min);
			      done();
			    });
		});
	});

});