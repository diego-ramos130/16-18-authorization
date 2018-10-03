'use strict';

const faker = require('faker');
const categoryMock = require('./category-mock');
const BlogPost = require('../../model/blog-post');


const blogPostMock = module.exports = {};

blogPostMock.pCreateBlogPostMock = () => {
  const resultMock = {};

  return categoryMock.pCreateCategoryMock()
    .then((createdCategoryMock) => {
      resultMock.category = createdCategoryMock;

      return new BlogPost({
        title: faker.lorem.words(5),
        content: faker.lorem.words(5),
        category: createdCategoryMock._id,
      }).save();
    })
    .then((createdBlogPostMock) => {
      resultMock.blogPost = createdBlogPostMock;
      return resultMock;
    });
};

blogPostMock.pCleanBlogPostMocks = () => {
  return Promise.all([
    BlogPost.remove({}),
    categoryMock.pCleanCategoryMocks(),
  ]);
};
