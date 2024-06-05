const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use("/customer/auth/*", function auth(req, res, next) {
    if (!req.session?.authorization) {
        return res.status(401).json({ message: "not logged in" });
        }
    const { accessToken, username } = req.session.authorization
    console.log(username, accessToken)
    try{
        jwt.verify(accessToken,"your_jwt_secret")}
        catch{
            return res.status(401).json({ message: "bad token :P" });
        }
    req.body.username=username
    next();
});


const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
