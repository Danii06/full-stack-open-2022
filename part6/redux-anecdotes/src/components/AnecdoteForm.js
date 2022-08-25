import {newAnecdoteFromEvent} from "../reducers/anecdoteReducer"
import { sendTimedNotifcation } from "../reducers/notificationReducer"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import React from "react"


const AnecdoteForm = (props) => {
	return (
		<>
			<h2>create new</h2>
			<form onSubmit={(e)=>{e.preventDefault()
				props.newAnecdoteFromEvent(e)
				props.sendTimedNotifcation("You added: \""+e.target.elements.form.value+"\"", 5000)
				e.target.form.value = ""
			}}>
				<div><input name="form"/></div>
				<button>create</button>
			</form>
		</>)
}

AnecdoteForm.propTypes = {
	newAnecdoteFromEvent: PropTypes.func.isRequired,
	sendTimedNotifcation: PropTypes.func.isRequired
}


const mapDispatchToProps = {
	newAnecdoteFromEvent,
	sendTimedNotifcation
}

export default connect(null, mapDispatchToProps)(AnecdoteForm)