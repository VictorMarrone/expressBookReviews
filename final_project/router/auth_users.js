const express = require("express");
const jwt = require("jsonwebtoken");
//const session = require("express-session");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.find((user) => user.username === username) ? true : false;
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validusers.length > 0;
};

//Task-7
//only registered users can login
regd_users.post("/login", (req,res) => {
  let user = req.body.username;
  let pass = req.body.password;
  if(!authenticatedUser(user,pass)){
      return res.status(403).json({message:"User not authenticated"})
  }

  let accessToken = jwt.sign({
      data: user
  },'access',{expiresIn:60*60})
  req.session.authorization = {
      accessToken
  }
  res.send("User logged in Successfully")
});

//Task-8
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    const isbn = req.params.isbn;
    
    let filtered_users = books.filter((user) => user.isbn === isbn);
    
    if (filtered_users?.length > 0) {
        // Select the first matching user and update attributes if provided
        let filtered_user = filtered_users[0];
        let review = req.query.reviews;    
        if (review) {
            filtered_user.reviews = review;
        }
        
        // Replace old user entry with updated user
        users = users.filter((user) => user.isbn != isbn);
        users.push(filtered_user);
        
        // Send success message indicating the user has been updated
        res.send(`User with the isbn ${isbn} updated.`);
    } else {
        // Send error message if no user found
        res.send("Unable to find user!");
    }
});

//Task-9
//Review Deleted
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.query.username;
  let book = books.find((user) => user.isbn === isbn);
  console.log(isbn, username, book);

  if (!!book) {
    delete book.reviews;
    return res.status(200).send("Review successfully deleted");
  }
  else {
    return res.status(404).json({message: `ISBN ${isbn} not found`});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;