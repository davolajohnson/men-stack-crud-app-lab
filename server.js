/********************  Config  ********************/
require('dotenv').config();          // .env for DATABASE_URL
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Book = require('./models/book');   // Mongoose model

const app = express();
const PORT = process.env.PORT || 3000;

/********************  Database Connection  **********************/
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', (err) => console.error(' MongoDB error:', err));
db.once('open', () => console.log('✅ Connected to MongoDB'));

/********************  Middleware  *******************************/
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));  // allows PUT & DELETE via forms

/********************  Routes  **********************************/

// Test route
app.get('/test', (req, res) => res.send('Server is running!'));

// Index - Show all books
app.get('/books', async (req, res) => {
  const books = await Book.find();
  res.render('books/index', { books });
});

// New - Show form to create a book
app.get('/books/new', (req, res) => {
  res.render('books/new');
});

// Create - Handle form submission and create book
app.post('/books', async (req, res) => {
  try {
    req.body.published = req.body.published === 'on';
    await Book.create(req.body);
    res.redirect('/books');
  } catch (err) {
    res.status(500).send('Error creating book: ' + err.message);
  }
});

// Show - Show a single book by ID
app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.render('books/show', { book });
  } catch (err) {
    res.status(404).send('Book not found');
  }
});

// Edit - Show form to edit a book
app.get('/books/:id/edit', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.render('books/edit', { book });
  } catch (err) {
    res.status(500).send('Error loading edit form: ' + err.message);
  }
});

// Update - Handle form submission to update book
app.put('/books/:id', async (req, res) => {
  try {
    req.body.published = req.body.published === 'on';
    await Book.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/books/${req.params.id}`);
  } catch (err) {
    res.status(500).send('Error updating book: ' + err.message);
  }
});

// Delete - Remove a book
app.delete('/books/:id', async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect('/books');
  } catch (err) {
    res.status(500).send('Error deleting book: ' + err.message);
  }
});

/********************  Start Server  *****************************/
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));

