import { useSelector, useDispatch } from "react-redux"
import {voteAndUpdateDatabase} from "../reducers/anecdoteReducer"
import { sendTimedNotifcation } from "../reducers/notificationReducer"
import React from "react"
import _ from "lodash"


const AnecdoteList = () => {
	const anecdotes = useSelector(state => state.anecdotes)
	const filter = useSelector(state => state.filter)
	const dispatch = useDispatch()

	return (<>
		{_.filter(_.sortBy(anecdotes,"votes"), (anecdote)=>anecdote.content.includes(filter)).reverse().map(anecdote =>
			<div key={anecdote.id}>
				<div>
					{anecdote.content}
				</div>
				<div>
        has {anecdote.votes}
					<button onClick={() => {
						dispatch(voteAndUpdateDatabase(anecdote))
						dispatch(sendTimedNotifcation("You voted \""+anecdote.content+"\"", 5000))
					}}>vote</button>
				</div>
			</div>
		)}
	</>)
}

export default AnecdoteList