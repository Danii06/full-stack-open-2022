const blogsRouter = require("express").Router()
const Blog = require("../models/Blog.js")

blogsRouter.get("/", async (request, response) => {
	response.json(await Blog.find({}))
})

blogsRouter.post("/", async (request, response) => {
	const blog = new Blog(request.body)

	response.status(201).json(await blog.save({ setDefaultsOnInsert: true }))
})

module.exports = blogsRouter