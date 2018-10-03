'use strict';

//! Vinicio - this is the ONE

const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: true,
    minlength: 10,
  },
  blogPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'blog-post',
    },
  ],
},
{
  usePushEach: true,
});

module.exports = mongoose.model('category', categorySchema);
