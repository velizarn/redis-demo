/* eslint no-undef: 0 */
/* eslint no-console: 0 */
'use strict';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../src/index');

describe('If you try to access a non-existing page', () => {
  it('it should show status 404', (done) => {
    chai.request(server)
      .get('/errorpage')
      .end( (err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        res.status.should.equal(404);
        done();
      });
  });
});
