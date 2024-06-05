const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    // Returns boolean
    // Write code to check if the username is valid
}

const authenticatedUser = (username, password) => {
    // Returns boolean
    // Write code to check if username and password match the one we have in records.
}

// Only registered users can login
regd_users.post('/login', (req, res) => {
    let users = require('./auth_users.js').users;
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const authenticatedUser = users.find(user => user.username === username && user.password === password);
    if (!authenticatedUser) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    const accessToken = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' });

    req.session.authorization = {
        accessToken,
        username
    };

    res.status(200).json({ message: "User successfully logged in", accessToken });
});

// Add a book review without authentication
regd_users.put('/auth/review/:isbn', (req, res) => {
   console.log("sTestsss")
    let isbn = req.params.isbn;
    let { username, review } = req.body;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!username || !review) {
        return res.status(400).json({ message: "Username and review are required" });
    }

    // Add or modify the review
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }
    books[isbn].reviews[username] = review;

    res.status(200).json({ message: "Review added/modified successfully", reviews: books[isbn].reviews });
});

// Delete a book review without authentication
regd_users.delete('/auth/review/:isbn', (req, res) => {
    let isbn = req.params.isbn;
    let { username } = req.body;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    }

    if (books[isbn].reviews && books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
    } else {
        return res.status(404).json({ message: "Review not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
