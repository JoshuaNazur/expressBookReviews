const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const keys = Object.keys(books);
 
  for (const key in books) {
  const author = req.params.author;
  if (books[key].author === author) {
    return res.send(JSON.stringify(books[key]));
  } 
  }

  return res.status(404).json({ message: "Author not found" });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const keys = Object.keys(books);
 
  for (const key in books) {
  const title = req.params.title;
  if (books[key].title === title) {
    return res.send(JSON.stringify(books[key]));
  } 
  }

  return res.status(404).json({ message: "Title not found" });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;  // Get ISBN (number) from request parameters

  // Check if the book with the given ISBN exists in the books object
  if (books[isbn]) {
      // Return the reviews for the book
      return res.send(JSON.stringify(books[isbn], null, 4));
  } else {
      // If book not found, return an error message
      return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
