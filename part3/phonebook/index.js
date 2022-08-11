var db = require('./db.json')
const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

app.use(express.static('build'))

app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body)
    ].join(' ')
}))

app.get('/api/persons',(req,res)=>{
    res.json(db)
})

app.get('/api/persons/:id',(req,res)=>{
    const entry = db.find((e)=>e.id===parseInt(req.params.id))
    if(entry){
        res.json(entry)
    }else{
        res.status(404).json({ error: 'No such ID in phonebook' })
    }
})

app.delete('/api/persons/:id',(req,res)=>{
    const entry = db.find((e)=>e.id===parseInt(req.params.id))
    if(entry){
        db=db.filter((e)=>e.id!==parseInt(req.params.id))
        res.status(204).end()
    }else{
        res.status(404).json({ error: 'No such ID in phonebook' })
    }
})

const generateID = () =>{
    return Math.floor(Math.random()*(1024+1))
}
app.post('/api/persons',(req,res)=>{
    const data = req.body
    if(!("name" in data && "number" in data)){
        res.status(400).json({
            error:"Name or Number missing"
        })
        return
    }
    
    if(db.map((person)=>person.name).includes(data.name)){
        res.status(403).json({
            error:"A record with that name already exists"
        })
        return
    }

    const newEntry = {name:data.name,number:data.number,id:generateID()}
    db = db.concat(newEntry)
    res.status(201).json(newEntry)
})

app.get('/info',(req,res)=>{
    res.send(`Phonebook has info for ${db.length} people<br>
            ${new Date().toString()}`)
})

const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})