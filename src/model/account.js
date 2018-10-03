'use strict';

const mongoose = require('mongoose');
const crypto = require('crypto'); // Vinicio - Random bytes
const jsonWebToken = require('jsonwebtoken'); // Vinicio - crypto
const bcrypt = require('bcrypt'); // Vinicio - hashing

const accountSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  tokenSeed: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
});

const TOKEN_SEED_LENGTH = 128;

function pCreateToken() {
  // Vinicio - the value of this in this function is equal to the specific
  // object we are working with
  this.tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
  // Vinicio - at this point, token seed is a random, 'unique', long string
  return this.save()
    .then((savedAccount) => {
      // Vinicio - at this point, we KNOW the tokenSeed was unique
      // Vinicio - sign, in this context, means encrypt
      return jsonWebToken.sign({
        tokenSeed: savedAccount.tokenSeed,
      }, process.env.SECRET);
    })
    .catch((error) => {
      throw error;
    });
}
// Vinicio - adding pCreateToken to the account's prototype
accountSchema.methods.pCreateToken = pCreateToken;
const Account = module.exports = mongoose.model('account', accountSchema);

// Vinicio - on a production system, this would be >=9
const HASH_ROUNDS = 8;

Account.create = (username, email, password) => {
  return bcrypt.hash(password, HASH_ROUNDS)
    .then((passwordHash) => {
      password = null; // eslint-disable-line
      const tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
      return new Account({
        username,
        email,
        tokenSeed,
        passwordHash,
      }).save();
    });
};
