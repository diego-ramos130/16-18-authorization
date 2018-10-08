'use strict';

const faker = require('faker');
const Account = require('../../model/account');

const accountMock = module.exports = {};

accountMock.pCreateMock = () => {
  const mock = {};
  mock.request = {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
  };

  return Account.create(mock.request.username, mock.request.email, mock.request.password)
    .then((createdAccount) => {
      mock.account = createdAccount;
      return mock;
    });
};

accountMock.pCleanAccountMocks = () => Account.remove({});
