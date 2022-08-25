import {voteAndUpdateDatabase} from "../reducers/anecdoteReducer"
import { sendTimedNotifcation } from "../reducers/notificationReducer"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import React from "react"
import _ from "lodash"


const AnecdoteList = (props) => {

	return (<>
		{_.filter(_.sortBy(props.anecdotes,"votes"), (anecdote)=>anecdote.content.includes(props.filter)).reverse().map(anecdote =>
			<div key={anecdote.id}>
				<div>
					{anecdote.content}
				</div>
				<div>
        has {anecdote.votes}
					<button onClick={() => {
						props.voteAndUpdateDatabase(anecdote)
						props.sendTimedNotifcation("You voted \""+anecdote.content+"\"", 5000)
					}}>vote</button>
				</div>
			</div>
		)}
	</>)
}

AnecdoteList.propTypes = {
	voteAndUpdateDatabase: PropTypes.func.isRequired,
	sendTimedNotifcation: PropTypes.func.isRequired,
	anecdotes: PropTypes.array.isRequired,
	filter: PropTypes.string.isRequired
}

function mapStateToProps (state) {
	return {
		filter:state.filter,
		anecdotes:state.anecdotes
	}
}

const mapDispatchToProps = {
	voteAndUpdateDatabase,
	sendTimedNotifcation
}

export default connect(mapStateToProps, mapDispatchToProps)(AnecdoteList)