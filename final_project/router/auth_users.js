const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  const result = users.find(user => user.username === username);
  if (typeof result === "undefined"){
    return false
  }
  return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  const result = users.find(user => user.username === username && user.password === password)
  if(typeof result === "undefined"){
    return false;
  }
  return true;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  if(!authenticatedUser(username,password)){
    
    return res.status(401).json({message: "username or password not valid"});
  }
  const token = jwt.sign({username},"12345",{expiresIn: "1d"});
  req.session.authorization = {accessToken: token, username};
  return res.status(200).json({message: "User logged"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const {review} = req.body;
  const {isbn} = req.params;
  const {username} = req.session.authorization
  books[isbn].reviews[username] = review;

  return res.status(200).json({message: "review added or updated",book:books[isbn]});
});

regd_users.delete("/auth/review/:isbn",(req,res)=>{
  const {isbn} = req.params;
  const {username} = req.session.authorization;

  books[isbn].reviews[username] = "";

  return res.status(200).json({message: "review deleted",book:books[isbn]});
})
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
