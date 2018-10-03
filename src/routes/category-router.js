'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');
//! Vinicio - I'm using capital N because Category is a class
const Category = require('../model/category');
const logger = require('../lib/logger');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();

router.post('/api/categories', jsonParser, (request, response, next) => {
  return new Category(request.body).save()
    .then((savedCategeory) => {
      logger.log(logger.INFO, 'Responding with a 200 status code');
      return response.json(savedCategeory);
    })
    .catch(next);
});

router.get('/api/categories/:id', (request, response, next) => {
  return Category.findById(request.params.id)
    //! Vinicio - mongoose will resolve whether or not it can find a Category
    .then((category) => {
      if (category) {
        logger.log(logger.INFO, 'Responding with a 200 status code and a category');
        return response.json(category);
      }
      logger.log(logger.INFO, 'Responding with a 404 status code. Category not Found');
      return next(new HttpError(404, 'category not found'));
    })
    .catch(next); //! Vinicio - by default a catch gets an error as the first argument
  //! Vinicio - mongoose will only reject in case of error
  // (not finding a category IS NOT CONSIDERED AN ERROR)
});
