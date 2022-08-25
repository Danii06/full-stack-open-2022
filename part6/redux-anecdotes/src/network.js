import axios from "axios"

const URL = "http://localhost:3001/anecdotes"

const getAll = async () => {
	const response = await axios.get(URL)
	return response.data
}

const save = async (anecdote) => {
	const response = await axios.post(URL, anecdote)
	return response.data
}

const update = async (anecdote) => {
	const response = await axios.put(URL+"/"+anecdote.id, anecdote)
	return response.data
}

export {getAll, save, update}