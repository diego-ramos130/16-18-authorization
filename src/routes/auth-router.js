'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');
//! Vinicio - I'm using capital N because Category is a class
const Account = require('../model/account');
const logger = require('../lib/logger');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();

router.post('/api/signup', jsonParser, (request, response, next) => {
  if (!request.body.password) {
    return next(new HttpError(401, ''));
  }
  // vinicio - this would be a great place to validate the password
  return Account.create(request.body.username, request.body.email,
    request.body.password) // 1 - Hash Password
    .then((createdAccount) => {
      delete request.body.password;
      logger.log(logger.INFO, 'AUTH - creating TOKEN');
      return createdAccount.pCreateToken(); // 2 - create and save token
    })
    .then((token) => {
      // Vinicio - over here, we don't need to save since the account it's saved in pCreateToken
      logger.log(logger.INFO, 'Responding with 200 status code and a token');
      return response.json({ token }); // 3 - return a token
    })
    .catch(next);
});
