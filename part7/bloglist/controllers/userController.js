const bcrypt = require("bcryptjs")
const userRouter = require("express").Router()
const User = require("../models/User")

userRouter.post("/", async (request, response) => {
	const newUserJSON = request.body

	if (newUserJSON.password.toString().length < 3) {
		response
			.status(400)
			.json({ error: "Password too short (minimum length is 3 characters)" })
		return
	}

	newUserJSON.password = await bcrypt.hash(newUserJSON.password.toString(), 10)

	const matchingUsers = await User.find({ username: newUserJSON.username })
	if (matchingUsers.length > 0) {
		response
			.status(422)
			.json({ error: "A user with that username already exists" })
		return
	}

	const newUser = await new User(request.body).save()
	response.status(201).json(newUser)
})

userRouter.get("/", async (request, response) => {
	const users = await User.find({}).populate("blogs").orFail()
	response.status(200).json(users)
})

module.exports = userRouter
