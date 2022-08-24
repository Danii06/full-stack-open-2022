import "./App.css"
import { useState, useEffect, useRef, React } from "react"
import Blog from "./components/Blog"
import blogService from "./services/blogs"
import loginService from "./services/loginService"
import LoginForm from "./components/LoginForm"
import BlogSubmitForm from "./components/BlogSubmitForm"
import Togglable from "./components/Toggleable"
import PropTypes from "prop-types"
import _ from "lodash"


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

Notification.propTypes = {
	message: PropTypes.string.isRequired,
	state: PropTypes.string.isRequired,
}


var notificationExpiryTimer = null
const App = () => {
	const [blogs, setBlogs] = useState([])
	const [user, setUser] = useState(null)
	const [token, setToken] = useState(null)
	const [message, setMessage] = useState(null)
	const [state, setState] = useState(null)
	const blogFormToggle = useRef()


	useEffect(() => {
		const savedUser = window.localStorage.getItem("user")
		if(savedUser && savedUser!=="null"){
			const user = JSON.parse(savedUser)
			setUser(user)
			setToken(user.token)
		}
		refreshBlogs()
	}, [])


	useEffect(() => {
		if(user!==null){
			window.localStorage.setItem("user", JSON.stringify(user))
			window.localStorage.setItem("token", JSON.stringify(token))
		}else{
			window.localStorage.removeItem("user")
			window.localStorage.removeItem("token")
		}
	},[user])



	const setNotification = (message, state) => {
		setMessage(message)
		setState(state)
		if(notificationExpiryTimer!==null){clearTimeout(notificationExpiryTimer)}
		notificationExpiryTimer = setTimeout(() => {
			setMessage(null)
		},3000)

	}

	const refreshBlogs = () => {
		blogService.getAll().then(blogs =>
			setBlogs( blogs )
		).catch((error)=>{
			if (error.response) {
				setNotification("No Blogs Found", NotificationState.Error)
			}
			setBlogs({})
		})
	}

	const login = (event) => {
		event.preventDefault()

		const username = event.target.elements.username.value
		const password = event.target.elements.password.value

		loginService.login(username, password).then(data => {
			setUser(data)
			setToken(data.token)
			setNotification("Logged in successfully", NotificationState.Success)
		}
		).catch(
			function (error) {
				if (error.response) {
					setNotification("Incorrect username or password", NotificationState.Error)
				}
			})


	}

	const submitBlog = (event) => {
		event.preventDefault()

		const title = event.target.elements.title.value
		const author = event.target.elements.author.value
		const url = event.target.elements.url.value

		blogService.post(title, author, url, token).then(() => {
			refreshBlogs()
			setNotification(`Added a new blog ${title} by ${author}`, NotificationState.Success)
		}).catch((error) => {
			if (error.response) {
				setNotification(error.response.data.error, NotificationState.Error)
			}
		}
		).finally(() => {
			blogFormToggle.current.toggleVisibility()
			event.target.elements.title.value=""
			event.target.elements.author.value=""
			event.target.elements.url.value=""
		}
		)
	}

	const updateLikes = (blogID, likes) => {
		blogService.put({ likes },blogID, token).then(() => {
			refreshBlogs()
		}).catch((error) => {
			setNotification("Error liking blog: " + error.response.data.error, NotificationState.Error)
		}
		)
	}

	const removeBlog = (blogID, blogName, blogAuthor) => {
		if(window.confirm(`Really delete ${blogName} by ${blogAuthor}?`)){
			blogService.del(blogID, token).then(() => {
				setNotification(`Deleted ${blogName} by ${blogAuthor}`, NotificationState.Success)
				refreshBlogs()
			}).catch((error) => {
				setNotification("Error deleting blog: " + error.response.data.error, NotificationState.Error)
			}
			)
		}
		refreshBlogs()
	}

	const logout = (event) => {
		event.preventDefault()
		setUser(null)
		setToken(null)
	}


	return (
		<div>
			<Notification message={message} state={state} />

			{user !== null ? (<><p>{user.username + " logged in"}<button onClick={logout} id="logoutbutton">Logout</button></p></>) : ""}

			{user === null ? (
				<LoginForm onSubmit={login}/>
			) : [
				<Togglable key="blogformtoggle" buttonLabel="Add new blog" ref={blogFormToggle}>
					<BlogSubmitForm onSubmit={submitBlog}/>
				</Togglable>
				,
				_.sortBy(blogs,"likes").reverse().map(blog =>
					<Blog key={blog.id} blog={blog} onLike={updateLikes} removeBlog={removeBlog} username={user.username}/>
				)]
			}

		</div>
	)
}

export default App
