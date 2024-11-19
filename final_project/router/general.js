const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if(typeof password === "undefined" || typeof username === "undefined" ){
    return res.status(400).json({message: "you must provide a username and password"});
  }
  const existUser = users.find(element => element.username === username );
  if(typeof existUser !== "undefined"){ 
    return res.status(400).json({message: "The username already exists"})
  }
  const user = {username,password}
  users.push(user)
  return res.status(201).json({message: "User registered", user});
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  const getBookList = new Promise((resolve, reject) => {
    const bookList = JSON.stringify(books, null, 1);
    resolve(bookList);
  });

  getBookList
    .then((bookList) => res.status(200).json(bookList))
    .catch((error) =>
      res.status(500).json({ message: "Internal Server Error" })
    );
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const getBookDetails = new Promise((resolve,reject)=>{
    const {isbn} = req.params;
    const bookDetails = books[isbn];
    resolve(bookDetails);
  });

  getBookDetails.then(bookDetails => res.status(200).json(bookDetails))
    .catch(error => res.status(500).json({message: "Internal Server Error" }));
  //const {isbn} = req.params;
  //return res.status(200).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

  const {author} = req.params;
  const getBookDetails = new Promise((resolve,reject)=>{
    let booksArray = Object.values(books);
    let authorBooks = booksArray.filter(element => element.author === author);

    resolve(authorBooks);
  })
  getBookDetails.then(authorBooks => res.status(200).json(authorBooks))
    .catch(error => res.status(500).json({message: "Internal Server Error" }));
  //let booksArray = Object.values(books);
  //let authorBooks = booksArray.filter(element => element.author === author)

  //return res.status(200).json(authorBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  
  const {title} = req.params;
  const getTitleBook = new Promise((resolve,reject)=>{
    let booksArray = Object.values(books);
    let titleBook = booksArray.find(element => element.title === title );
    resolve(titleBook);
  });

  getTitleBook.then(books => res.status(200).json(books))
    .catch(error => res.status(500).json({message: "Internal Server Error" }));
  //let booksArray = Object.values(books);
  //let titleBook = booksArray.find(element => element.title === title )

  //return res.status(200).json(titleBook);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

  const {isbn} = req.params;
  const bookReview = books[isbn].reviews
  return res.status(200).json({reviews: bookReview});
});

module.exports.general = public_users;
