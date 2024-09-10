const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    console.log(typeof(req.query.password));
    // Check if the password query parameter matches the expected value
    if (req.query.password !== "pwd1234") {
        // Send an error response if the password does not match
        return res.status(402).send("This user cannot login ");
    }
    // Log the current time
    console.log('Time:', Date.now());
    // Call the next middleware function
    next();
});
 
const PORT =3000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));