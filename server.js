/********************  Config  ********************/
require('dotenv').config();                // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const Book = require('./models/book');     // Mongoose model

const app = express();
const PORT = process.env.PORT || 3000;

/********************  Database Connection  ********************/
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', (err) => console.error('MongoDB connection error:', err));
db.once('open', () => console.log('✅ Connected to MongoDB'));

/********************  Middleware  *****************************/
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');                  // EJS as view engine

/********************  Routes  *********************************/

// Test route
app.get('/test', (req, res) => res.send('Server is running!'));

// Index: Show all books
app.get('/books', async (req, res) => {
  const books = await Book.find({});
  res.render('books/index', { books });
});

// New: Show form to create a new book
app.get('/books/new', (req, res) => {
  res.render('books/new');
});

// Create: Handle form submission to create a book
app.post('/books', async (req, res) => {
  try {
    req.body.published = req.body.published === 'on';
    await Book.create(req.body);
    res.redirect('/books');
  } catch (err) {
    res.status(500).send('Error creating book: ' + err.message);
  }
});

// Show: Display a single book
app.get('/books/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.render('books/show', { book });
});

// Edit: Show form to edit a book
app.get('/books/:id/edit', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.render('books/edit', { book });
  } catch (err) {
    res.status(500).send('Error loading edit form: ' + err.message);
  }
});

// Update: Handle form submission to update a book
app.post('/books/:id', async (req, res) => {
  try {
    req.body.published = req.body.published === 'on';
    await Book.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/books');
  } catch (err) {
    res.status(500).send('Error updating book: ' + err.message);
  }
});

// Delete: Remove a book
app.post('/books/:id/delete', async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect('/books');
  } catch (err) {
    res.status(500).send('Error deleting book: ' + err.message);
  }
});

/********************  Start Server  ***************************/
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
