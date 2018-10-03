'use strict';

//! Vinicio - this file is the many

const mongoose = require('mongoose');
const HttpError = require('http-errors');
const Category = require('./category'); //! Vinicio - this is the one :(

const blogPostSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  content: {
    type: String,
  },
  category: { //! Vinicio - this right here is what's making the connection
    type: mongoose.Schema.Types.ObjectId,
    required: true, //! Vinicio - we need to have a one before we can create a many
    ref: 'category',
  },
});
// -------------------------------------------------------------------------------------
// CRUD RULES
// -------------------------------------------------------------------------------------
function blogPostPreHook(done) {
  //! Vinicio - the value of this inside this function is going to be the document
  // that's going to be saved
  return Category.findById(this.category)
    .then((categoryFound) => {
      if (!categoryFound) {
        throw new HttpError(404, 'category not found');
      }
      //! Vinicio - first I make changes to the model
      categoryFound.blogPosts.push(this._id);
      //! Vinicio - then, I save the model
      return categoryFound.save();
    })
    .then(() => done()) //! Vinicio - done without arguments means success
    .catch(error => done(error));
  // .catch(done);//! Vinicio - done with one argument means an error
}

const blogPostPostHook = (document, done) => {
  return Category.findById(document.category)
    .then((categoryFound) => {
      if (!categoryFound) {
        //! Vinicio - SEND SMS, CONTACT DRI
        throw new HttpError(500, 'category not found');
      }
      categoryFound.blogPosts = categoryFound.blogPosts.filter((blogPost) => {
        return blogPost._id.toString() !== document._id.toString();
      });
      return categoryFound.save();
    })
    .then(() => done())
    .catch(error => done(error)); // .catch(done);
};

blogPostSchema.pre('save', blogPostPreHook);
blogPostSchema.post('remove', blogPostPostHook);
// -------------------------------------------------------------------------------------

module.exports = mongoose.model('blog-post', blogPostSchema);

// let x = {
//   title: 'gregor is derps',
//   content : 'gregor is love',
//   timestamp: new Date(),
//   category: '845792394dosiaoseusaoeutaoseu'
// };
//
// x.populate('category'); //! Vinicio - this is similar to a JOIN without the messy syntax.
//
// let x = {
//   title: 'gregor is derps',
//   content : 'gregor is love',
//   timestamp: new Date(),
//   category: {
//     title: '',
//     content: '',
//     timestamp: '',
//   },
// };
