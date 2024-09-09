const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const app = express();
const public_users = require('./router/public_users.js').general;
let users = require('./router/auth_users.js').users;
let isValid = require('./router/auth_users.js').isValid;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use session middleware for session management
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

// Middleware for checking authentication using token
app.use("/customer/auth/*", function auth(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
});

// Public user routes (non-authenticated)
app.use('/public', public_users);

// Example login route to generate token
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (isValid(username, password)) {
    const token = jwt.sign({ username }, 'your_secret_key', { expiresIn: '1h' });
    return res.json({ token });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
