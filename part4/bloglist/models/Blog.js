const mongoose = require("mongoose")

const blog = new mongoose.Schema({
	title: String,
	author: String,
	url: String,
	likes: Number
})

const Blog = mongoose.model("Blog", blog)

module.exports = Blog