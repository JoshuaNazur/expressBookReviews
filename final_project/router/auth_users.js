const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
// Filter the users array for any user with the same username
// Filter the users array for any user with the same username
let userswithsamename = users.filter((user) => {
  return user.username === username;
});
// Return true if any user with the same username is found, otherwise false
if (userswithsamename.length > 0) {
  return true;
} else {
  return false;
}
};

const authenticatedUser = (username,password)=>{ //returns boolean
// Filter the users array for any user with the same username and password
let validusers = users.filter((user) => {
  return (user.username === username && user.password === password);
});
// Return true if any valid user is found, otherwise false
if (validusers.length > 0) {
  return true;
} else {
  return false;
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign({
          data: password
      }, 'access', { expiresIn: 60 * 60 });

      // Store access token and username in session
      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).send("User successfully logged in");
  } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
   // Get the ISBN from the URL and the review from the query string
  const isbn = req.params.isbn;
  const review = req.query.review;

  // Get the logged-in username from the session
  const username = req.body.username;

  // Check if the user is logged in (if username exists in session)
  if (!username) {
    return res.status(401).json({ message: "You must be logged in to post a review." });
  }

  // Check if the review is provided in the query
  if (!review) {
    return res.status(400).json({ message: "Review text is required." });
  }

  // Check if the book exists by ISBN
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Check if the book already has reviews
  if (!books[isbn].reviews) {
    books[isbn].reviews = {}; // Initialize an empty reviews object if not present
  }

  // Check if the current user has already posted a review for this book
  if (books[isbn].reviews[username]) {
    // If the user has already posted a review, modify it
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review updated successfully." });
  } else {
    // If the user has not posted a review yet, add it
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review added successfully." });
  }
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Get the ISBN from the URL
  const isbn = req.params.isbn;
  
  // Get the logged-in username from the session
  const username = req.body.username;

  // Check if the user is logged in (if username exists in session)
  if (!username) {
    return res.status(401).json({ message: "You must be logged in to delete a review." });
  }

  // Check if the book exists by ISBN
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Check if the book has reviews
  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found for this book." });
  }

  // Delete the review for the current user
  delete books[isbn].reviews[username];

  // Return success message
  return res.status(200).json({ message: "Review deleted successfully." });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
