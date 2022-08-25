import React from "react"
import AnecdoteForm from "./components/AnecdoteForm"
import AnecdoteList from "./components/AnecdoteList"
import Filter from "./components/Filter"
import Notification from "./components/Notification"
import { useEffect } from "react"
import {initializeAnecdotes} from "./reducers/anecdoteReducer"
import { connect } from "react-redux"
import PropTypes from "prop-types"

const App = (props) => {
	useEffect(()=>{
		props.initializeAnecdotes()
	},[])

	return (
		<div>
			<Notification />
			<h2>Anecdotes</h2>	
			<Filter />
			<AnecdoteList />
			<AnecdoteForm />
		</div>
	)
}

App.propTypes = {
	initializeAnecdotes: PropTypes.func.isRequired
}

const mapDispatchToProps = {
	initializeAnecdotes
}

export default connect(null, mapDispatchToProps)(App)