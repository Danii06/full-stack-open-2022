const _ = require("lodash")

const dummy = () => {
	return 1
}

const totalLikes = (blogs) => {
	if(blogs.length===0){
		return 0
	}
	return blogs.reduce((prev,curr) => prev+("likes" in curr ? curr.likes : 0),0)
}

const favoriteBlog = (blogs) => {
	if(blogs.length===0){
		return undefined
	}
	return blogs.reduce((fav,blog) => fav.likes > blog.likes ? fav : blog)
}

const mostBlogs = (blogs) => {
	if(blogs.length===0){
		return undefined
	}

	const result = _.chain(blogs)
		.countBy("author")
		.toPairs()
		.maxBy((x) => x[1])
		.value()
	return { author:result[0], blogs:result[1] }
}

const mostLikes = (blogs) => {
	if(blogs.length===0){
		return undefined
	}

	return _.chain(blogs)
		.groupBy("author")
		.toPairs()
		.map((x) => {return {
			author:x[0],
			likes:_.sum(_.map(x[1],"likes"))
		}})
		.maxBy("likes")
		.value()
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }