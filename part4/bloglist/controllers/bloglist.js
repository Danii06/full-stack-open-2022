const blogsRouter = require("express").Router()
const Blog = require("../models/Blog.js")

blogsRouter.get("/", async (request, response) => {
	response.json(await Blog.find({}))
})

blogsRouter.post("/", async (request, response) => {
	const blog = new Blog(request.body)

	response.status(201).json(await blog.save({ setDefaultsOnInsert: true }))
})

blogsRouter.delete("/:id", async (request, response) => {

	const doc = await Blog.findByIdAndDelete(request.params.id)
	if(!doc)
		response.status(403).json({ error:"ID does not match any existing document" })
	else
		response.status(204).send()
})

blogsRouter.put("/:id", async (request, response) => {

	const data = await Blog.findByIdAndUpdate(request.params.id, request.body)
	if(!data)
		response.status(403).json({ error:"Error" })
	else
		response.status(200).json(data).send()
})

module.exports = blogsRouter