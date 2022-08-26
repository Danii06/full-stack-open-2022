const supertest = require("supertest")
const app = require("../app")
const mongoose = require("mongoose")
const User = require("../models/User")
const api = supertest(app)

let testUser = {
	name: "TestName",
	username: "TestUserName",
	password: "TestPassWord",
}

require("dotenv").config()

const mongoUrl = `mongodb+srv://daniad:${process.env.MONGODB_PASS}@cluster0.fk6a8ig.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(mongoUrl)

describe("Users api test", () => {
	describe("invalid user creation requests are rejected", () => {
		beforeEach(async () => {
			testUser = {
				name: "TestName",
				username: "TestUserName",
				password: "TestPassWord",
			}
			await User.deleteMany({})
			await api
				.post("/api/users")
				.send({ name: "name", username: "username", password: "password" })
				.expect(201)
		})

		afterEach(async () => {
			const users = await api.get("/api/users").expect(200)
			expect(users.body.length).toBe(1)
		})

		test("missing name", async () => {
			testUser.name = undefined
			await api.post("/api/users").send(testUser).expect(400)
		})

		test("missing username", async () => {
			testUser.username = undefined
			await api.post("/api/users").send(testUser).expect(400)
		})

		test("non-unique username", async () => {
			testUser.username = "username"
			await api.post("/api/users").send(testUser).expect(422)
		})

		test("missing password", () => {
			testUser.password = undefined
			api.post("/api/users").send(testUser).expect(400)
		})

		test("short password", () => {
			testUser.password = 1
			api.post("/api/users").send(testUser).expect(400)
		})
	})
})
