const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post('/register', function (req, res) {
    let users = require('./auth_users.js').users;
    let { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    let userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users.push({ username, password });
    res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        // Simulate an asynchronous operation
        let response = await new Promise((resolve) => {
            setTimeout(() => resolve({ data: books }), 100);
        });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        let isbn = req.params.isbn;
        let response = await new Promise((resolve) => {
            setTimeout(() => resolve({ data: books[isbn] }), 100);
        });
        let book = response.data;

        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching book details" });
    }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        let author = req.params.author;
        let response = await new Promise((resolve) => {
            setTimeout(() => resolve({ data: books }), 100);
        });
        let booksData = response.data;
        let booksByAuthor = [];

        for (let isbn in booksData) {
            if (booksData[isbn].author === author) {
                booksByAuthor.push(booksData[isbn]);
            }
        }

        if (booksByAuthor.length > 0) {
            res.status(200).json(booksByAuthor);
        } else {
            res.status(404).json({ message: "Books by this author not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        let title = req.params.title;
        let response = await new Promise((resolve) => {
            setTimeout(() => resolve({ data: books }), 100);
        });
        let booksData = response.data;
        let booksByTitle = [];

        for (let isbn in booksData) {
            if (booksData[isbn].title === title) {
                booksByTitle.push(booksData[isbn]);
            }
        }

        if (booksByTitle.length > 0) {
            res.status(200).json(booksByTitle);
        } else {
            res.status(404).json({ message: "Books with this title not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by title" });
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    let isbn = req.params.isbn;
    let book = books[isbn];

    if (book) {
        res.status(200).json(book.reviews);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
