const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const Blog = require("../models/Blog")
const User = require("../models/User")
const _ = require("lodash")

require("dotenv").config()

const mongoUrl = `mongodb+srv://daniad:${process.env.MONGODB_PASS}@cluster0.fk6a8ig.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(mongoUrl)

const api = supertest(app)

const blogs = [
	{
		_id: "5a422a851b54a676234d17f7",
		title: "React patterns",
		author: "Michael Chan",
		url: "https://reactpatterns.com/",
		likes: 7,
		__v: 0,
	},
	{
		_id: "5a422aa71b54a676234d17f8",
		title: "Go To Statement Considered Harmful",
		author: "Edsger W. Dijkstra",
		url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
		likes: 5,
		__v: 0,
	},
	{
		_id: "5a422b3a1b54a676234d17f9",
		title: "Canonical string reduction",
		author: "Edsger W. Dijkstra",
		url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
		likes: 12,
		__v: 0,
	},
	{
		_id: "5a422b891b54a676234d17fa",
		title: "First class tests",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
		likes: 10,
		__v: 0,
	},
	{
		_id: "5a422ba71b54a676234d17fb",
		title: "TDD harms architecture",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
		likes: 0,
		__v: 0,
	},
	{
		_id: "5a422bc61b54a676234d17fc",
		title: "Type wars",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
		likes: 2,
		__v: 0,
	},
]

describe("Blog API test", () => {
	var token = undefined

	beforeEach(async () => {
		var matchingUsers = await User.find({ username: "BLOG API TEST USER" })
		if (matchingUsers.length === 0)
			await api.post("/api/users").send({
				name: "BLOG API TEST USER",
				username: "BLOG API TEST USER",
				password: "BLOG API TEST USER",
			})

		matchingUsers = await User.find({ username: "BLOG API TEST USER" })
		const user = matchingUsers[0]

		await api
			.post("/api/login")
			.send({
				username: "BLOG API TEST USER",
				password: "BLOG API TEST USER",
			})
			.expect(function (res) {
				token = res.body.token
			})

		var blogsWithUser = _.map(blogs, (blog) => {
			blog.user = user._id
			return blog
		})

		await Blog.deleteMany({})
		await Promise.all(blogsWithUser.map((x) => new Blog(x).save()))
	})

	test("blogs are returned as json", async () => {
		await api
			.get("/api/blogs")
			.expect(200)
			.expect("Content-Type", /application\/json/)
	})

	test("unique identifier property of blogs is id", async () => {
		const content = await api.get("/api/blogs").expect(200)
		content.body.map((x) => expect(x._id).toBeDefined())
	})

	test("correctly add blog to blog list", async () => {
		const testinfo = {
			title: "Test title",
			author: "Test author",
			url: "Test url",
			likes: 7357,
		}

		const contentBefore = await api.get("/api/blogs").expect(200)
		const lengthBefore = contentBefore.body.length

		await api
			.post("/api/blogs")
			.set("Authorization", "Bearer " + token)
			.send(testinfo)
			.expect(201)

		const contentAfter = await api.get("/api/blogs").expect(200)
		const lengthAfter = contentAfter.body.length

		expect(lengthAfter).toBe(lengthBefore + 1)
		expect(
			_.chain(contentAfter.body)
				.map((x) => {
					return {
						author: x.author,
						title: x.title,
						url: x.url,
						likes: x.likes,
					}
				})
				.value()
		).toContainEqual(testinfo)
	})

	test("missing likes field defaults to zero", async () => {
		const testinfo = {
			title: "Test title",
			author: "Test author",
			url: "Test url",
		}

		await api
			.post("/api/blogs")
			.set("Authorization", "Bearer " + token)
			.send(testinfo)
			.expect(201)

		const contentAfter = await api.get("/api/blogs").expect(200)

		testinfo.likes = 0

		expect(
			_.chain(contentAfter.body)
				.map((x) => {
					return {
						author: x.author,
						title: x.title,
						url: x.url,
						likes: x.likes,
					}
				})
				.value()
		).toContainEqual(testinfo)
	})

	test("missing title and url field causes 400 status code", async () => {
		const testinfo = {
			author: "Test author",
			likes: 7357,
		}

		await api
			.post("/api/blogs")
			.set("Authorization", "Bearer " + token)
			.send(testinfo)
			.expect(400)
	})

	test("successfully delete an entry", async () => {
		const contentBefore = await api.get("/api/blogs").expect(200)
		const lengthBefore = contentBefore.body.length

		await api
			.delete("/api/blogs/5a422a851b54a676234d17f7")
			.set("Authorization", "Bearer " + token)
			.send()
			.expect(204)

		const contentAfter = await api.get("/api/blogs").expect(200)
		const lengthAfter = contentAfter.body.length

		expect(lengthAfter).toBe(lengthBefore - 1)

		const newBlog = blogs[0]
		newBlog.user.id = Buffer.from(newBlog.user.id).toString("hex")

		expect(
			_.chain(contentAfter.body)
				.concat(blogs[0])
				.sortBy("_id")
				.map((blog) => {
					blog.user = blog.user.id.toString()
					return blog
				})
				.value()
		).toEqual(
			_.chain(contentBefore.body)
				.sortBy("_id")
				.map((blog) => {
					blog.user = blog.user.id.toString()
					return blog
				})
				.toJSON()
		)
	})

	test("deleting malformatted id causes 400 status code", async () => {
		await api
			.delete("/api/blogs/1")
			.set("Authorization", "Bearer " + token)
			.send()
			.expect(400)
	})

	test("deleting nonexistant entry causes 403 status code", async () => {
		await api
			.delete("/api/blogs/5a422a851b54a676234d17f7")
			.set("Authorization", "Bearer " + token)
			.send()
			.expect(204)

		await api
			.delete("/api/blogs/5a422a851b54a676234d17f7")
			.set("Authorization", "Bearer " + token)
			.send()
			.expect(403)
	})

	test("successfully update an entry", async () => {
		const contentBefore = await api.get("/api/blogs").expect(200)
		const lengthBefore = contentBefore.body.length

		const updatedBlog = { ...blogs[0] }
		updatedBlog.likes = -1
		updatedBlog.url = "TestURL"
		updatedBlog.author = "TestAuthor"
		updatedBlog.title = "TestTitle"

		await api
			.put("/api/blogs/5a422a851b54a676234d17f7")
			.set("Authorization", "Bearer " + token)
			.send(updatedBlog)
			.expect(204)

		const contentAfter = await api.get("/api/blogs").expect(200)
		const lengthAfter = contentAfter.body.length

		expect(lengthAfter).toBe(lengthBefore)

		expect(
			_.map(contentAfter.body, (blog) => {
				blog.user = blog.user.id
				return blog
			})
		).toContainEqual(
			expect.objectContaining({
				_id: updatedBlog._id,
				title: updatedBlog.title,
				author: updatedBlog.author,
				likes: updatedBlog.likes,
				url: updatedBlog.url,
			})
		)
	})

	test("updating an entry with incorrect or missing information causes 400 status code", async () => {
		const updatedBlog = { ...blogs[0] }
		updatedBlog.likes = "Hello"
		updatedBlog.url = undefined
		updatedBlog.author = 1
		updatedBlog.title = { title: "Test" }

		await api
			.put("/api/blogs/5a422a851b54a676234d17f7")
			.set("Authorization", "Bearer " + token)
			.send(updatedBlog)
			.expect(400)
	})

	test("updating malformatted id causes 400 status code", async () => {
		await api
			.put("/api/blogs/1")
			.send({ title: "TestTitle" })
			.set("Authorization", "Bearer " + token)
			.expect(400)
	})

	test("updating a nonexistant entry causes 403 status code", async () => {
		await api
			.delete("/api/blogs/5a422a851b54a676234d17f7")
			.set("Authorization", "Bearer " + token)
			.send()
			.expect(204)

		await api
			.put("/api/blogs/5a422a851b54a676234d17f7")
			.set("Authorization", "Bearer " + token)
			.send({ title: "TestTitle" })
			.expect(403)
	})

	test("adding new blog without authorization causes 401 error", async () => {
		await api.post("/api/blogs").send(blogs[0]).expect(401)
	})
})

afterAll(async () => {
	await Promise.all([Blog.deleteMany({}), mongoose.connection.destroy()])
})
