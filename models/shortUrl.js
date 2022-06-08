const mongoose = require('mongoose');
const shortId = require('shortid');

const shortUrlSchema = new mongoose.Schema({
  full: {
    type: String,
    required: true,
  },
  short: {
    type: String,
    required: true,
    default: shortId.generate,
  },
  created_at: {
    type: Number,
    required: true,
    default: new Date()
  }
});

module.exports = mongoose.model('ShortUrl', shortUrlSchema);
