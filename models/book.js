const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  genre: String,
  pages: Number,
  published: Boolean,
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
