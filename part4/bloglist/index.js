//const http = require("http")
const mongoose = require("mongoose")
const logger = require("./utils/logger.js")
require("dotenv").config()
const app = require("./app")

const mongoUrl = `mongodb+srv://daniad:${process.env.MONGODB_PASS}@cluster0.fk6a8ig.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(mongoUrl)


const PORT = 3003
app.listen(PORT, () => {
	logger.info(`Server running on port ${PORT}`)
})