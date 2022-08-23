const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const loginRouter = require("express").Router()
const User = require("../models/User")

loginRouter.post("/", async (request, response) => {
	const userForm = request.body

	const user = await User.findOne({ username: userForm.username }).orFail()

	if(!(user && await bcrypt.compare(userForm.password, user.password))){
		response.status(401).json({ error: "Username or password incorrect" })
		return
	}


	const token = jwt.sign({ username: user.username, id: user._id }, process.env.SECRET)

	response.status(200).send({ token, username: user.username })
})

module.exports = loginRouter