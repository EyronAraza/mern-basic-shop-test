// Import modules
const mongoose = require('mongoose')

// Create schema (basically creates table's headers to the database's collection)
const employeeSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

// Put schema to the newly created model
// This create a new model/collection in the database called "employees"
const employeeModel = mongoose.model("employees", employeeSchema)

// Export module
module.exports = employeeModel