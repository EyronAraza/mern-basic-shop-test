// Import modules
const mongoose = require('mongoose')

// Create schema (basically creates table's headers to the database's collection)
const cartSchema = new mongoose.Schema({
    name: String,
    item: String,
    price: String
})

// Put schema to the newly created model
// This create a new model/collection in the database called "employees"
const cartModel = mongoose.model("users-cart", cartSchema)

// Export module
module.exports = cartModel