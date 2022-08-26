const blogsRouter = require("express").Router()
const { JsonWebTokenError } = require("jsonwebtoken")
const Blog = require("../models/Blog.js")

blogsRouter.get("/", async (request, response) => {
	response.status(200).json(await Blog.find({}).orFail().populate("user"))
})

blogsRouter.post("/", async (request, response) => {
	if (!request.user) throw JsonWebTokenError

	const blog = request.body
	let user = request.user
	let userID = request.user._id

	blog.user = userID
	const savedBlog = await new Blog(blog).save({ setDefaultsOnInsert: true })

	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()

	response.status(201).json(savedBlog)
})

blogsRouter.delete("/:id", async (request, response) => {
	if (!request.credentials) throw JsonWebTokenError

	const doc = await Blog.findById(request.params.id).orFail()

	if (doc.user._id.toString() === request.credentials.id) {
		await Blog.findByIdAndDelete(request.params.id).orFail()
		response.status(204).send()
	} else {
		response.status(401).json({ error: "User is not author of document" })
	}
})

blogsRouter.put("/:id", async (request, response) => {
	const doc = await Blog.findById(request.params.id).orFail()
	if (
		JSON.stringify(Object.keys(request.body)) ===
			JSON.stringify(Object.keys({ likes: 0 })) ||
		doc.user._id.toString() === request.credentials.id
	) {
		await Blog.findByIdAndUpdate(request.params.id, request.body).orFail()
		response.status(204).send()
	} else {
		response.status(401).json({ error: "User is not author of document" })
	}
})

module.exports = blogsRouter
