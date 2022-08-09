import './App.css'
import { useEffect, useState } from 'react'
import phonebook from './services/phonebook.js'


const Filter = ({setSearch}) => {
  return <p> Search: <input onChange={(e)=>setSearch(e)} /></p>
}

const Numbers = ({persons, Search, deletePerson}) => {
  return persons
          .filter((person) => person.name.toLowerCase().includes(Search.toLowerCase()))
            .map((person)=>
              <div key={person.name}><li >{person.name} {person.number}</li>
              <button onClick={(e)=>deletePerson(person.name)}>Delete</button></div>
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

const NotificationState = {
  Success: "success",
  Error: "error"
}

const Notification = ({ message, state }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={state}>
      {message}
    </div>
  )
}

var notificationExpiryTimer = null
const App = () => {
  const [persons, setPersons] = useState([])


  useEffect(()=>{
    phonebook.getAll().then(
      response => {
        console.log(response)
        setPersons(response)
      })
    }
  ,[])
  

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [Search, setSearch] = useState('')
  const [message, setMessage] = useState(null)
  const [state, setState] = useState(NotificationState.Success)

  const names = (persons) => persons.reduce((prev,curr)=>prev.concat(curr.name),[])
  
  const setNotification = (message, state) => {
    setMessage(message)
    setState(state)
    if(notificationExpiryTimer!==null){clearTimeout(notificationExpiryTimer)}
    notificationExpiryTimer = setTimeout(()=>{
      setMessage(null)
    },3000)
    
  }

  const addPerson = () => {
    phonebook.post({name: newName, number: newNumber}).then(
      (response) => {setPersons(persons.concat(response))}
    )
  }

  const deletePerson = (name) => {
    if(window.confirm(`Delete ${name}?`))
      phonebook.delete(name, persons).then(
      (response) => {
        setPersons(persons.filter((p)=>p.name!==name));
        setNotification(`Removed ${name}`,NotificationState.Success)
      }
    ).catch( (error) =>
    setNotification(`Information of ${name} was already removed from the server`,NotificationState.Error)
    )
  }

  const submitRecord = (e) =>{
    e.preventDefault()
    if (!(names(persons).includes(newName))) {
      addPerson()
      setNotification(`Added ${newName}`,NotificationState.Success)
    } else {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with the new one?`)) {
        phonebook.put({ name: newName, number: newNumber }, newName, persons).then((response) =>{
          setPersons(persons.filter((p) => p.name !== newName).concat(response))
          setNotification(`Updated phone number for ${newName}`,NotificationState.Success)
        }
        ).catch( (error) =>
        setNotification(`Information of ${newName} was already removed from the server`,NotificationState.Error)
        )
      }
    }
  }
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} state={state}/>
      <InputRecord persons={persons} setPersons={setPersons} 
        onNameChange={(e)=>{setNewName(e.target.value)}}
        onNumberChange={(e)=>{setNewNumber(e.target.value)}} 
        onSubmit={submitRecord}/>
      <Filter setSearch={(e)=>{setSearch(e.target.value)}}/>
      <Numbers persons={persons} Search={Search} deletePerson={deletePerson}/>
    </div>
  )
}

export default App