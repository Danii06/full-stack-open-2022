const express = require("express")
const app = express()
require("express-async-errors")
const logger = require("./utils/logger")
const User = require("./models/User")
const jwt = require("jsonwebtoken")
const cors = require("cors")

app.use(cors())
app.use(express.json())

const tokenExtractor = (req,res,next) => {

	const authorization = req.get("Authorization")
	if((!authorization||!authorization.toLowerCase().includes("bearer ")))
		req.token = undefined
	else
		req.token = req.get("Authorization").substring("Bearer ".length)

	next()
}


const userExtractor = async (req,res,next) => {

	if(!req.token){
		next()
		return
	}

	req.credentials = jwt.verify(req.token,process.env.SECRET,{ algorithm:"HS256" })


	if(req.credentials.id && req.credentials.username)
		req.user = await User.findById(req.credentials.id).orFail()

	next()
}

app.use(tokenExtractor)
app.use(userExtractor)


if (process.env.NODE_ENV === "test") {
	const testingRouter = require("./controllers/testingController.js")
	app.use("/api/testing", testingRouter)
}

const blogsRouter = require("./controllers/bloglist.js")
app.use("/api/blogs",blogsRouter)

const usersRouter = require("./controllers/userController.js")
app.use("/api/users",usersRouter)

const loginRouter = require("./controllers/loginController.js")
app.use("/api/login",loginRouter)



// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
	logger.error(err.stack)
	if(err.name === "ValidationError")
		res.status(400).json({ error: err.message })
	if(err.name === "CastError")
		res.status(400).json({ error: err.message })
	if (err.name === "JsonWebTokenError")
		res.status(401).json({ error: "Missing or invalid token" })
	if(err.name === "DocumentNotFoundError")
		res.status(403).json({ error:"Data does not match any existing entry" })
})


module.exports=app