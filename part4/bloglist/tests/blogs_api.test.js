const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const Blog = require("../models/Blog")
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

describe("blogs_api_test", () => {

	beforeEach(async () => {
		await Blog.deleteMany({})
		await Promise.all(blogs.map(x => new Blog(x).save()))
	})

	test("blogs are returned as json", async () => {
		await api
			.get("/api/blogs")
			.expect(200)
			.expect("Content-Type", /application\/json/)
	})

	test("unique identifier property of blogs is id", async () => {
		const content = await api.get("/api/blogs").expect(200)
		content.body.map(x => expect(x._id).toBeDefined())
	})

	test("correctly add blog to blog list", async () => {
		const testinfo = {
			title: "Test title",
			author: "Test author",
			url: "Test url",
			likes: 7357 }

		const contentBefore = await api.get("/api/blogs").expect(200)
		const lengthBefore = contentBefore.body.length

		await api.post("/api/blogs").send(testinfo).expect(201)

		const contentAfter = await api.get("/api/blogs").expect(200)
		const lengthAfter = contentAfter.body.length

		expect(lengthAfter).toBe(lengthBefore+1)
		expect(_.chain(contentAfter.body)
			.map(x => {return {
				author:x.author,
				title:x.title,
				url:x.url,
				likes:x.likes
			}})
			.value()).toContainEqual(testinfo)
	})

	test("missing likes field defaults to zero", async () => {
		const testinfo = {
			title: "Test title",
			author: "Test author",
			url: "Test url" }

		await api.post("/api/blogs").send(testinfo).expect(201)

		const contentAfter = await api.get("/api/blogs").expect(200)

		testinfo.likes = 0

		expect(_.chain(contentAfter.body)
			.map(x => {return {
				author:x.author,
				title:x.title,
				url:x.url,
				likes:x.likes
			}})
			.value()).toContainEqual(testinfo)
	})

	test("missing title and url field causes 400 status code", async () => {
		const testinfo = {
			author: "Test author",
			likes: 7357
		}

		await api.post("/api/blogs").send(testinfo).expect(400)
	})

})




afterAll(async () => {
	await Promise.all([Blog.deleteMany({}),mongoose.connection.destroy()])
})
