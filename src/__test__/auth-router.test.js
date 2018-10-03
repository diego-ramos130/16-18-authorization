'use strict';

const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server');

const API_URL = `http://localhost:${process.env.PORT}/api/signup`;


describe('AUTH ROUTER', () => {
  beforeAll(server.start);
  afterAll(server.stop);

  test('should return with a 200 status code and a token', () => {
    return superagent.post(API_URL)
      .send({
        username: faker.lorem.words(1),
        password: faker.lorem.words(1),
        email: faker.internet.email(),
      }).then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });
});
