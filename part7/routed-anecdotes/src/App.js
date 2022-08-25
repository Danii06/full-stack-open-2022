import { useState } from "react"
import {Link, BrowserRouter as Router, Routes, Route, useParams, useNavigate} from "react-router-dom"
import React from "react"

const Menu = () => {
	const padding = {
		paddingRight: 5
	}
	return (
		<div>
			<Link to="/" style={padding}>anecdotes</Link>
			<Link to="/create" style={padding}>create new</Link>
			<Link to="/about" style={padding}>about</Link>
		</div>
	)
}

const Anecdote = ({ anecdotes }) => {
	const id = useParams().id
	const anecdote = anecdotes.find(anecdote => anecdote.id===Number(id))
	return (
		<div><br />
			<strong>{anecdote.content}</strong><br />
			<em>by {anecdote.author}</em>
			<div>Votes: {anecdote.votes}</div> <br />
		</div>
	)
}

const AnecdoteList = ({ anecdotes }) => (
	<div>
		<h2>Anecdotes</h2>
		<ul>
			{anecdotes.map(anecdote => <li key={anecdote.id} ><Link to={`/${anecdote.id}`}>{anecdote.content}</Link></li>)}
		</ul>
	</div>
)

const About = () => (
	<div>
		<h2>About anecdote app</h2>
		<p>According to Wikipedia:</p>

		<em>An anecdote is a brief, revealing account of an individual person or an incident.
		Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
		such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
		An anecdote is "a story with a point."</em>

		<p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
	</div>
)

const Footer = () => (
	<div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
	</div>
)

const CreateNew = (props) => {
	const [content, setContent] = useState("")
	const [author, setAuthor] = useState("")
	const [info, setInfo] = useState("")
	const navigate = useNavigate()


	const handleSubmit = (e) => {
		e.preventDefault()
		props.addNew({
			content,
			author,
			info,
			votes: 0
		})
		navigate("/")
		props.setTimedNotification("a new anecdote "+content+" created!")
	}

	return (
		<div>
			<h2>create a new anecdote</h2>
			<form onSubmit={handleSubmit}>
				<div>
          content
					<input name='content' value={content} onChange={(e) => setContent(e.target.value)} />
				</div>
				<div>
          author
					<input name='author' value={author} onChange={(e) => setAuthor(e.target.value)} />
				</div>
				<div>
          url for more info
					<input name='info' value={info} onChange={(e)=> setInfo(e.target.value)} />
				</div>
				<button>create</button>
			</form>
		</div>
	)

}


const Notification= (props) => {
	const success = {
		color: "rgb(32, 129, 32)",
		background: "lightgrey",
		fontSize: "20px",
		borderStyle: "solid",
		borderRadius: "5px",
		padding: "10px",
		marginBottom: "10px"
	}
	return (props.message!==""?<p style={success}>{props.message}</p>:null)
	
}

const App = () => {
	const [anecdotes, setAnecdotes] = useState([
		{
			content: "If it hurts, do it more often",
			author: "Jez Humble",
			info: "https://martinfowler.com/bliki/FrequencyReducesDifficulty.html",
			votes: 0,
			id: 1
		},
		{
			content: "Premature optimization is the root of all evil",
			author: "Donald Knuth",
			info: "http://wiki.c2.com/?PrematureOptimization",
			votes: 0,
			id: 2
		}
	])

	const [notification, setNotification] = useState("")

	var notificationExpiryTimer = null
	const setTimedNotification = (message) => {
		setNotification(message)
		if(notificationExpiryTimer!==null){clearTimeout(notificationExpiryTimer)}
		notificationExpiryTimer = setTimeout(() => {
			setNotification("")
		},5000)

	}

	const addNew = (anecdote) => {
		anecdote.id = Math.round(Math.random() * 10000)
		setAnecdotes(anecdotes.concat(anecdote))
	}

	const anecdoteById = (id) =>
		anecdotes.find(a => a.id === id)

	const vote = (id) => {
		const anecdote = anecdoteById(id)

		const voted = {
			...anecdote,
			votes: anecdote.votes + 1
		}

		setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
	}

	return (
		<>
		<Notification message={notification}/>
		<Router>
			<h1>Software anecdotes</h1>
			<Menu />
			<Routes>
				<Route path="/:id" element={<Anecdote anecdotes={anecdotes} />} />
				<Route path="/" element={<AnecdoteList anecdotes={anecdotes}/>} />
				<Route path="/create" element={<CreateNew addNew={addNew} setTimedNotification={setTimedNotification}/>} />
				<Route path="/about" element={<About />} />
			</Routes>
		</Router>
		<Footer />
		</>
	)
}

export default App
