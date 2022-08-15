//const http = require("http")
const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const logger = require("./utils/logger.js")
require("dotenv").config()

const mongoUrl = `mongodb+srv://daniad:${process.env.MONGODB_PASS}@cluster0.fk6a8ig.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())

const blogsRouter = require("./controllers/bloglist.js")
app.use("/api/blogs",blogsRouter)

const PORT = 3003
app.listen(PORT, () => {
	logger.info(`Server running on port ${PORT}`)
})
