// Import modules
require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const cookieParser = require('cookie-parser')

// ENV variables
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// Import DB Models
const employeeModel = require('./models/employee')
const cartModel = require('./models/cart-list')

const client_url = "https://mern-basic-shop-test-client.vercel.app"

// Create express app
const app = express()
app.use(express.json()) // To parse JSON request bodies, to use "req.body" allowing you to access this data sent via form.
app.use(cors({
    origin: [client_url],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    exposedHeaders: ["set-cookie"]
}
)) // cors is to allow cross origin (allows your server to accept requests from different origins)
app.use(cookieParser())

// Connect to mongo database
// mongoose.connect("mongodb://localhost:27017/Login")
mongoose.connect(MONGO_URI)

// Server response test
app.get('/', (req, res) => {
    res.json("Connected to Express. Hello World!")
})

// Handle POST requests for login page
app.post('/login', (req, res) => {
    const { email, password } = req.body
    employeeModel.findOne({ email: email })
        .then(user => {
            // Check if email exists
            if (user) {
                // Compare input password with database's user password
                bcrypt.compare(password, user.password, (err, response) => {
                    // check if password is correct
                    if (response) {
                        // Create web token 
                        const token = jwt.sign({ email: user.email }, JWT_SECRET_KEY, { expiresIn: "1d" })
                        res.cookie("token", token, { // store token into cookie
                            secure: true,
                            path: '/',
                            sameSite: 'none',
                            domain: '.vercel.app'
                        })

                        // Store the username in a cookie
                        res.cookie('username', user.name, {
                            secure: true,
                            path: '/',
                            sameSite: 'none',
                            domain: '.vercel.app'
                        });

                        res.json("Success")
                    } else {
                        res.json("wrong password")
                    }
                })
            } else { // check if email doesnt exists
                res.json("No record existed")
            }
        })
})

// Handle POST requests for register page
app.post('/register', (req, res) => {
    // Check if name or email exists in database
    employeeModel.findOne({ $or: [{ name: req.body.name }, { email: req.body.email }] })
        .then(existingUser => {
            if (existingUser) {
                res.json("User with the same name or email already exists!")
            } else {
                const { name, email, password } = req.body
                bcrypt.hash(password, 10) // hash password
                    .then(hash => {
                        // Add registered users to the database
                        employeeModel.create({ name, email, password: hash })
                        res.json("Registered")
                            .then(employees => res.json(`USER CREATED! ${employees}`))
                            .catch(err => res.json(err))
                    }).catch(err => console.log(err.message))
            }
        })
        .catch(err => res.status(500).json(err))
})

// Middleware to verify if user is logged in
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    // console.log(token)
    if (!token) {
        return res.json("Token not available. User not logged in, sending you back to home page.")
    } else {
        jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
            if (err) return res.json("Token is wrong.")
            next()
        })
    }
}

// Handle GET requests for Home page
app.get('/home', verifyUser, (req, res) => {
    return res.json("Success (Token checked!)")
})

// Handle POST requests for added cart items
app.post('/cart', (req, res) => {
    // Add item details to the database
    const { name, item, price } = req.body
    cartModel.create({ name, item, price })
        .then(item => res.json(`item is posted to database. ${item}"`))
        .catch(err => res.json(err))
})

// Handle GET requests to check if an item is in the cart (returns bool)
app.get('/cart/status', async (req, res) => {
    const { username, item } = req.query;

    if (!username || !item) {
        return res.status(400).send({ message: "Username and item name are required" });
    }

    try {
        // Adjust the query to find items matching both username and item name
        const items = await cartModel.find({ name: username, item: item });
        const isInCart = items.length > 0;
        res.send({ isInCart });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Handle GET requests to check to look for any added items
app.get('/cart/items', async (req, res) => {
    const { username } = req.query;
    if (!username) {
        return res.status(400).send({ message: "Username is required" });
    }
    try {
        // Look for added cart items by a user
        const items = await cartModel.find({ name: username });
        res.send(items);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Handle DELETE requests for added cart items
app.delete('/cart/:username/:itemName', async (req, res) => {
    const { username, itemName } = req.params;

    try {
        // Find and delete the specific item for the given username and itemName
        await cartModel.findOneAndDelete({ name: username, item: itemName });

        res.json({ message: `Item "${itemName}" for user ${username} has been deleted.` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Run port aka running the website's server
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
})

// Export Express API
module.exports = app;