import { useDispatch } from "react-redux"
import {newAnecdoteFromEvent} from "../reducers/anecdoteReducer"
import { sendTimedNotifcation } from "../reducers/notificationReducer"
import React from "react"


const AnecdoteForm = () => {
	const dispatch = useDispatch()

	

	return (
		<>
			<h2>create new</h2>
			<form onSubmit={(e)=>{e.preventDefault()
				dispatch(newAnecdoteFromEvent(e))
				dispatch(sendTimedNotifcation("You added: \""+e.target.elements.form.value+"\"", 5000))
				e.target.form.value = ""
			}}>
				<div><input name="form"/></div>
				<button>create</button>
			</form>
		</>)
}

export default AnecdoteForm