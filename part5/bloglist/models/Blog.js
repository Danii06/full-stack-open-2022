const mongoose = require("mongoose")

const blog = new mongoose.Schema({
	title: { type: String, required: true },
	author: String,
	url: { type: String, required: true },
	likes: { type: Number, default: 0 },
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	}
})

const Blog = mongoose.model("Blog", blog)

module.exports = Blog