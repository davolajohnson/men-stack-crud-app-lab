const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  author:   { type: String, required: true },
  description: String,
  published:   { type: Boolean, default: false }
});

module.exports = mongoose.model('Book', bookSchema);
