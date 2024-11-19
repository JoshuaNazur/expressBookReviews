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
public_users.get('/', async (req, res) => {
  try {
    // Simulate async operation (like fetching from a database)
    const promise = await new Promise((resolve, reject) => {
        resolve(books);  // Resolving with the local books data
    });

    return res.status(200).json(promise);  // Send the books data back to the client
  } catch (error) {
    console.error('Error fetching books:', error.message);
    return res.status(500).send('Internal Server Error');
  }
});



// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try{
    const promise = await new Promise((resolve, reject) => {
      resolve(books[isbn]);  
  });
  return res.status(200).json(promise); 
  } catch (error) {
    console.error('Error fetching books:', error.message);
    return res.status(500).send('Internal Server Error');
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const keys = Object.keys(books);
 
  try{
    const promise = await new Promise((resolve, reject) => {
    for (const key in books) {
    const author = req.params.author;
    if (books[key].author === author) {
     resolve(books[key]);
  } 
  }
});
return res.status(200).json(promise); 
} catch (error) {
  console.error('Error fetching books:', error.message);
  return res.status(500).send('Internal Server Error');
}
});

// Get all books based on title
public_users.get('/title/:title', async  (req, res) => {
  const keys = Object.keys(books);
 
  try{
    const promise = await new Promise((resolve, reject) => {
    for (const key in books) {
    const title = req.params.title;
    if (books[key].title === title) {
     resolve(books[key]);
  } 
  }
});
return res.status(200).json(promise); 
} catch (error) {
  console.error('Error fetching books:', error.message);
  return res.status(500).send('Internal Server Error');
}
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
