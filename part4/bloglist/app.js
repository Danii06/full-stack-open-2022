const express = require("express")
const app = express()
require("express-async-errors")
const logger = require("./utils/logger")
const cors = require("cors")

app.use(cors())
app.use(express.json())

const blogsRouter = require("./controllers/bloglist.js")
app.use("/api/blogs",blogsRouter)

const usersRouter = require("./controllers/userController")
app.use("/api/users",usersRouter)

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
	logger.error(err.stack)
	if(err.name === "ValidationError")
		res.status(400).json({ error: err.message })
	if(err.name === "CastError" || err.name == "")
		res.status(400).json({ error: err.message })
})


module.exports=app