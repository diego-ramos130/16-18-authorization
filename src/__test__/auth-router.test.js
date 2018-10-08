'use strict';

const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server');
const accountMock = require('./lib/account-mock');

const API_URL = `http://localhost:${process.env.PORT}/api/signup`;
const API_IN = `http://localhost:${process.env.PORT}/api/signin`;

describe('/api/signup', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  beforeEach(accountMock.pCleanAccountMocks);

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
  test('should return with a 401 if no request body or invalid body', () => {
    return superagent.post(API_URL)
      .send({
        banjo: 'yeet',
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(401);
      });
  });
});

describe('/api/signin', () => {
  beforeAll(server.start);
  afterAll(server.stop);

  test('should return with a 400 if the user cant be auth', () => {
    return superagent.get(API_IN)
      .auth('asdf', 'asdf')
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });

  test('should return with a 200 and a token if valid auth', () => {
    return accountMock.pCreateMock()
      .then((mock) => {
        return superagent.get(API_IN)
          .auth(mock.request.username, mock.request.password);
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });
});
