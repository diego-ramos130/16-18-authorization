'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');
//! Vinicio - I'm using capital N because Category is a class
const BlogPost = require('../model/blog-post');
const logger = require('../lib/logger');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();

router.post('/api/blog-posts', jsonParser, (request, response, next) => {
  return new BlogPost(request.body).save()
    .then((savedBlogPost) => {
      logger.log(logger.INFO, 'Responding with a 200 status code');
      response.json(savedBlogPost);
    })
    .catch(error => next(error));
});

router.put('/api/blog-posts/:id', jsonParser, (request, response, next) => {
  const updateOptions = {
    runValidators: true,
    new: true,
  };
  return BlogPost.findByIdAndUpdate(request.params.id, request.body, updateOptions)
    .then((updatedBlogPost) => {
      if (!updatedBlogPost) {
        logger.log(logger.INFO, 'Responding with a 404 status code');
        return next(new HttpError(404, 'could not find blog post to update'));
      }
      logger.log(logger.INFO, 'Responding with a 200 status code');
      return response.json(updatedBlogPost);
    })
    .catch(error => next(error));
});
