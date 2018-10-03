'use strict';

const superagent = require('superagent');
const server = require('../lib/server');
const blogPostMock = require('./lib/blog-post-mock');

const API_URL = `http://localhost:${process.env.PORT}/api/blog-posts`;

describe('/api/categories', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  beforeEach(blogPostMock.pCleanBlogPostMocks);

  test('should respond with 200 status and an updated card', () => {
    let savedMock;
    return blogPostMock.pCreateBlogPostMock()
      .then((mock) => {
        savedMock = mock;
        return superagent.put(`${API_URL}/${mock.blogPost._id}`)
          .send({
            title: 'I am a new and updated title',
          });
      }) //! Vinicio - this mock object has two things: a category and a blog post
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.content).toEqual(savedMock.blogPost.content);
        expect(response.body.title).toEqual('I am a new and updated title');
        expect(response.body.category.toString()).toEqual(savedMock.category._id.toString());
      });
  });
});
