const database = require("./services/database")
const express = require("express")
const morgan = require("morgan")
require("express")
const app = express()

database.connect()

app.use(express.json())

app.use(express.static("build"))

app.use(morgan(function (tokens, req, res) {
	return [
		tokens.method(req, res),
		tokens.url(req, res),
		tokens.status(req, res),
		tokens.res(req, res, "content-length"), "-",
		tokens["response-time"](req, res), "ms",
		JSON.stringify(req.body)
	].join(" ")
}))

app.get("/api/persons", (req, res) => {
	database.getAll().then((data) => {
		if (data === undefined) {
			return {}
		}
		res.json(data)
	})
})

const handleIDExistence = (id) => {
	return database.findID(id).then((person) => {
		return [!!person, person]
	})
}

app.get("/api/persons/:id", (req, res, next) => {
	handleIDExistence(req.params.id, next).then(([exists, person]) => {
		if (exists) {
			res.json(person)
		} else {
			res.status(404).json({ error: "No such ID in phonebook" })
		}
	}).catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
	handleIDExistence(req.params.id, next).then(([exists,]) => {
		if (exists) {
			database.del(req.params.id)
			res.status(204).end()
		} else {
			res.status(404).json({ error: "No such ID in phonebook" })
		}
	}).catch(error => next(error))
})


app.post("/api/persons", (req, res, next) => {
	const data = req.body
	database.findName(data.name).then((names) => {
		if (names.length !== 0) {
			res.status(403).json({
				error: "A record with that name already exists"
			})
		}
		const newEntry = { name: data.name, number: data.number }
		database.add(newEntry).then((person) => {
			res.status(201).json(person)
		}).catch((e) => next(e))

	})

})

app.put("/api/persons/:id", (req, res, next) => {
	const data = req.body
	handleIDExistence(req.params.id, next).then(([exists, person]) => {
		if (exists) {
			database.updateByID(req.params.id, data).then(() => { data.id = person._id; res.status(200).json(data) }).catch(error => next(error))
		} else {
			res.status(404).json({ error: "No such ID in phonebook" })
		}
	})

})

app.get("/info", (req, res) => {
	database.getAll().then((data) => {
		if (data === undefined) {
			return {}
		}
		res.send(`Phonebook has info for ${data.length} people<br>
            ${new Date().toString()}`)
	})

})

const errorHandler = (error, request, response, next) => {
	console.error("Error:", error.message)

	if (error.name === "CastError") {
		response.status(400).send({ error: "Malformatted ID" })
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message })
	}

	next(error)
}

app.use(errorHandler)

const port = process.env.PORT || 3001
app.listen(port, () => {
	console.log(`Phonebook app listening on port ${port}`)
})

process.on("exit", function () {
	database.disconnect()
})