import { createSlice } from "@reduxjs/toolkit"
import { getAll, save, update } from "../network"

const anecdoteSlice = createSlice({
	name: "anecdote",
	initialState:[],
	reducers: {
		vote(state, action) {
			return state.map((anecdote) => anecdote.id !== action.payload ? anecdote : {content: anecdote.content, id: anecdote.id, votes: anecdote.votes+1})
		},
		newAnecdote(state, action) {

			return state.concat(action.payload)
		},
		setAnecdotes(state, action) {
			return action.payload
		}
	}
})


const initializeAnecdotes = () => {
	return async dispatch => {
		const anecdote = await getAll()
		dispatch(setAnecdotes(anecdote))
	}
}

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
	return {
		content: anecdote,
		id: getId(),
		votes: 0
	}
}

const newAnecdoteFromEvent = (e) => {
	return async dispatch => {
		const anecdote = asObject(e.target.elements.form.value)
		dispatch(newAnecdote(anecdote))
		save(anecdote)
	}
}

const voteAndUpdateDatabase = (anecdote) => {
	return async dispatch => {
		anecdote = {...anecdote, votes: anecdote.votes+1}
		update(anecdote)
		dispatch(anecdoteSlice.actions.vote(anecdote.id))
	}
}

export {initializeAnecdotes, newAnecdoteFromEvent, voteAndUpdateDatabase}
export const {vote, newAnecdote, setAnecdotes} = anecdoteSlice.actions
export default anecdoteSlice.reducer