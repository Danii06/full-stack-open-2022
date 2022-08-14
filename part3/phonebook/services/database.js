const mongoose = require('mongoose')
require('dotenv').config()

const url = `mongodb+srv://daniad:${process.env.MONGODB_PASS}@cluster0.fk6a8ig.mongodb.net/?retryWrites=true&w=majority`

const person = mongoose.Schema({
    name:{
        type:String,
        minLength: 3,
        required: true
    },
    number:{
        type:String,
        minLength:8,
        required: true
    },
})

person.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person',person)



const connect = () => {
    mongoose.connect(url)  
}

const getAll = () => {  
    return Person.find({}).then((res) => res)
}

const add = (person) => {  
    return new Person(person).save()
}

const findID = (id) => {
    return Person.findById(id)
}

const findName = (name) => {
    return Person.find({name:name})
}

const updateByID = (id, data) => {
    return Person.findByIdAndUpdate(id,data,{runValidators: true})
}

const del = (id) => {
    return findID(id).then((res) => {
        res.delete()
    })
}

const disconnect = () => {
    mongoose.connection.close()
}

module.exports = {getAll, add, del, findID, findName, updateByID, connect, disconnect}