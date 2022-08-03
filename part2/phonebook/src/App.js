import { useEffect, useState } from 'react'
import axios from 'axios'

const Filter = ({setSearch}) => {
  return <p> Search: <input onChange={(e)=>setSearch(e)} /></p>
}

const Numbers = ({persons, Search}) => {

  return persons
          .filter((person) => person.name.toLowerCase().includes(Search.toLowerCase()))
            .map((person)=>
              <li key={person.name}>{person.name} {person.number}</li>
            )
}

const InputRecord = ({onNameChange, onNumberChange, onSubmit}) => {

  return (
          <form onSubmit={onSubmit}>
            <div>
              Name: <input onChange={(e)=>onNameChange(e)} />
            </div>
            <div>
              Number: <input onChange={(e)=>onNumberChange(e)} />
            </div>
            <div>
              <button type="submit">Add</button>
            </div>
          </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  useEffect( ()=>{
      axios.get("http://localhost:3001/persons").then(
      response => {
        setPersons(response.data)
      })
    }
  ,[])
  

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [Search, setSearch] = useState('')

  const names = (persons) => persons.reduce((prev,curr)=>prev.concat(curr.name),[])
  
  const submitRecord = (e) =>{
    e.preventDefault()
    if(!(names(persons).includes(newName)))
      setPersons(persons.concat({name: newName, number: newNumber}))
    else
      alert(`${newName} is already added to phonebook`)
  }
  
  return (
    <div>
      <h2>Phonebook</h2>
      <InputRecord persons={persons} setPersons={setPersons} 
        onNameChange={(e)=>{setNewName(e.target.value)}}
        onNumberChange={(e)=>{setNewNumber(e.target.value)}} 
        onSubmit={submitRecord}/>
      <Filter setSearch={(e)=>{setSearch(e.target.value)}}/>
      <Numbers persons={persons} Search={Search} />
    </div>
  )
}

export default App