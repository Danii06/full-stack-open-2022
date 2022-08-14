const mongoose = require("mongoose")

if (process.argv.length < 3) {
	console.log("Please provide the password as an argument: node mongo.js <password>")
	process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://daniad:${password}@cluster0.fk6a8ig.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
	name: String,
	number: String
})

const Person = mongoose.model("Person", personSchema)


if (process.argv.length === 3) { //Print all entries
	console.log("phonebook:")
	Person.find({}).then((res) => {
		res.forEach(person => {
			console.log(person.name, person.number)
		})
		mongoose.connection.close()
	})

} else if (process.argv.length === 5) { //Add new entry
	new Person({ name: process.argv[3], number: process.argv[4] }).save().then(() => {
		console.log("Added new person to database")
		mongoose.connection.close()
	})
} else {
	console.log(`No action specified for number of arguments ${process.argv.length}`)
}

