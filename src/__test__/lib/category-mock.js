'use strict';

const faker = require('faker');
const Category = require('../../model/category');

const categoryMock = module.exports = {};

//! Vinicio - p is Vinicio's convention to know that the function will return promise.
categoryMock.pCreateCategoryMock = () => {
  return new Category({
    title: faker.lorem.words(10),
    content: faker.lorem.words(10),
  }).save(); //! Vinicio - this line is actually calling/using MONGO
};

categoryMock.pCleanCategoryMocks = () => {
  //! Vinicio - this line over here makes sure to clean the DB when we call it!
  return Category.remove({});
};
