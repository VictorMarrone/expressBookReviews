const express = require("express");
const bodyParser = require("body-parser");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const app = express();
app.use(bodyParser.json());

//Task-6
//Register USer
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }
  if (isValid(username)) {
    return res.status(400).json({ error: "Username already exists." });
  }
  if(username && password) {
    users.push({"username": username, "password": password});
  }
  return res.status(201).json({ message: "User registered successfully." });
});

//Task-1 & 10
// Get the book list available in the shop
function fetchBooks() {
  return new Promise((resolve, reject) => {
    // Simulate asynchronous operation (e.g., database query)
    setTimeout(() => {
      resolve(books);
    }, 1000); // Simulate a delay
  });
}
public_users.get("/", function (req, res) {
  fetchBooks()
  .then(books =>{
    res.json(books);
  })
  .catch(error => {
    res.status(500).json({ error: 'Failed to fetch books' });
  });
});

//Task-2 & 11
// Get book details based on ISBN
function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    // Simulate async operation
    setTimeout(() => {
      const book = books.find(book => book.isbn === isbn);
      if (book) {
        resolve(book);
      } else {
        reject(new Error('Book not found'));
      }
    }, 1000); // Simulating a delay of 1 second
  });
}
public_users.get("/isbn/:isbn", function (req, res) {
  const isbnum = req.params.isbn;
  getBookByISBN(isbnum)
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error: error.message }));
});

  // let filterByisbn = books.filter((book) => book.isbn == isbnum);
  // return res.status(300).json({ filterByisbn });
//});

//Task-3 & 12
// Get book details based on author
function getBookByAuthor(author) {
  return new Promise((resolve, reject) => {
    // Simulate async operation
    setTimeout(() => {
      const book = books.find(book => book.author === author);
      if (book) {
        resolve(book);
      } else {
        reject(new Error('Book not found'));
      }
    }, 1000); // Simulating a delay of 1 second
  });
}
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  getBookByAuthor(author)
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error: error.message }));
  // let filteredBooks = books.filter((book) => book.author === author);
  // return res.status(200).json({ filteredBooks });
});

//Task-4 & 13
// Get all books based on title
function getBookByTitle(title) {
  return new Promise((resolve, reject) => {
    // Simulate async operation
    setTimeout(() => {
      const book = books.find(book => book.title === title);
      if (book) {
        resolve(book);
      } else {
        reject(new Error('Book not found'));
      }
    }, 1000); // Simulating a delay of 1 second
  });
}
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  getBookByTitle(title)
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error: error.message }));
  // let filterBookByTitle = books.filter((book) => book.title === title);
  // return res.status(200).json({ filterBookByTitle });
});

//Task-5
//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  // Extract ISBN from request parameters
  const isbn = req.params.isbn;
  console.log(isbn);
  if (!isbn) {
    return res.status(400).json({ message: "ISBN parameter is required." });
  }
  const book = books.find((b) => b.isbn === isbn);
  console.log("Book found:", book);
  if (book) {
    res.json({
      isbn: isbn,
      reviews: book.reviews,
    });
  } else {
    // Send a 404 response if the book is not found
    res.status(404).json({
      message: "Reviews not found for the given ISBN.",
    });
  }
});
module.exports.general = public_users;