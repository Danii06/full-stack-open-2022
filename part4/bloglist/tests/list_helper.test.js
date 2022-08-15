const listHelper = require("../utils/list_helper")

const blogs = [
	{
		_id: "5a422a851b54a676234d17f7",
		title: "React patterns",
		author: "Michael Chan",
		url: "https://reactpatterns.com/",
		likes: 7,
		__v: 0
	},
	{
		_id: "5a422aa71b54a676234d17f8",
		title: "Go To Statement Considered Harmful",
		author: "Edsger W. Dijkstra",
		url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
		likes: 5,
		__v: 0
	},
	{
		_id: "5a422b3a1b54a676234d17f9",
		title: "Canonical string reduction",
		author: "Edsger W. Dijkstra",
		url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
		likes: 12,
		__v: 0
	},
	{
		_id: "5a422b891b54a676234d17fa",
		title: "First class tests",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
		likes: 10,
		__v: 0
	},
	{
		_id: "5a422ba71b54a676234d17fb",
		title: "TDD harms architecture",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
		likes: 0,
		__v: 0
	},
	{
		_id: "5a422bc61b54a676234d17fc",
		title: "Type wars",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
		likes: 2,
		__v: 0
	}
]
const oneBlog = [
	{
		_id: "5a422a851b54a676234d17f7",
		title: "React patterns",
		author: "Michael Chan",
		url: "https://reactpatterns.com/",
		likes: 7,
		__v: 0
	}
]


describe("Total likes", () => {
	test("of empty list is zero", () => {
		expect(listHelper.totalLikes([])).toBe(0)
	})
	test("of single blog is blog's likes", () => {
		expect(listHelper.totalLikes(oneBlog)).toBe(oneBlog[0].likes)
	})
	test("of a list of blogs is calculated correctly", () => {
		expect(listHelper.totalLikes(blogs)).toBe(36)
	})
})

describe("Favorite blog", () => {
	test("of an empty list is undefined", () => {
		expect(listHelper.favoriteBlog([])).toBe(undefined)
	})
	test("of a list of one blog is that blog", () => {
		expect(listHelper.favoriteBlog(oneBlog)).toEqual(oneBlog[0])
	})
	test("of a list of blogs is calculated correctly", () => {
		expect(listHelper.favoriteBlog(blogs)).toEqual({
			_id: "5a422b3a1b54a676234d17f9",
			title: "Canonical string reduction",
			author: "Edsger W. Dijkstra",
			url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
			likes: 12,
			__v: 0
		})
	})
})

describe("Author with most blogs", () => {
	test("of an empty list is undefined", () => {
		expect(listHelper.mostBlogs([])).toBe(undefined)
	})
	test("of a list of one blog is that blog's author", () => {
		expect(listHelper.mostBlogs(oneBlog)).toEqual({ author:oneBlog[0].author,blogs:1 })
	})
	test("of a list of blogs is calculated correctly", () => {
		expect(listHelper.mostBlogs(blogs)).toEqual({ author:"Robert C. Martin",blogs:3 })
	})
})

describe("Author with most likes", () => {
	test("of an empty list is undefined", () => {
		expect(listHelper.mostLikes([])).toBe(undefined)
	})
	test("of a list of one blog is that blog's author", () => {
		expect(listHelper.mostLikes(oneBlog)).toEqual({ author:oneBlog[0].author, likes:oneBlog[0].likes })
	})
	test("of a list of blogs is calculated correctly", () => {
		expect(listHelper.mostLikes(blogs)).toEqual({ author:"Edsger W. Dijkstra", likes:17 })
	})
})


