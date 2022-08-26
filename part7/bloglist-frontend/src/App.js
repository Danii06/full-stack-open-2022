import "./App.css"
import { Container } from "@mui/material"
import { useState, useEffect, useRef, React } from "react"
import Blog from "./components/Blog"
import blogService from "./services/blogs"
import loginService from "./services/loginService"
import LoginForm from "./components/LoginForm"
import BlogSubmitForm from "./components/BlogSubmitForm"
import PropTypes from "prop-types"
import Typography from "@mui/material/Typography"
import { List } from "@mui/material"
import { Slide } from "@mui/material"
import _ from "lodash"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { Button } from "@mui/material"
import { Box } from "@mui/material"

const NotificationState = {
	Success: "success",
	Error: "error",
}

const Notification = ({ message, state }) => {
	if (message === null) {
		return null
	}

	return <div className={state}>{message}</div>
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
	const [destroyInput, setDestroyInput] = useState(false)
	const blogFormToggle = useRef()
	const [loginSlide, setLoginSlide] = useState(false)
	const [openConfirmation, setOpenConfirmation] = useState(false)
	const [blogName, setTitle] = useState("")
	const [blogAuthor, setAuthor] = useState("")
	const [blogID, setID] = useState("")
	const [blogSubmitFormOpen, setBlogSubmitFormOpen] = useState(false)

	useEffect(() => {
		const savedUser = window.localStorage.getItem("user")
		if (savedUser && savedUser !== "null") {
			const user = JSON.parse(savedUser)
			setUser(user)
			setToken(user.token)
		}
		refreshBlogs()
	}, [])

	useEffect(() => {
		if (user !== null) {
			window.localStorage.setItem("user", JSON.stringify(user))
			window.localStorage.setItem("token", JSON.stringify(token))
			setLoginSlide(true)
		} else {
			window.localStorage.removeItem("user")
			window.localStorage.removeItem("token")
		}
	}, [user])

	const setNotification = (message, state) => {
		setMessage(message)
		setState(state)
		if (notificationExpiryTimer !== null) {
			clearTimeout(notificationExpiryTimer)
		}
		notificationExpiryTimer = setTimeout(() => {
			setMessage(null)
		}, 3000)
	}

	const refreshBlogs = () => {
		blogService
			.getAll()
			.then((blogs) => setBlogs(blogs))
			.catch((error) => {
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

		loginService
			.login(username, password)
			.then((data) => {
				setDestroyInput(true)
				setLoginSlide(true)
				setTimeout(() => {
					setUser(data)
					setToken(data.token)
					setNotification("Logged in successfully", NotificationState.Success)
					setDestroyInput(false)
				}, 2000)
			})
			.catch(function (error) {
				if (error.response) {
					setNotification(
						"Incorrect username or password",
						NotificationState.Error
					)
				}
			})
	}

	const submitBlog = (e, title, author, url) => {
		blogService
			.post(title, author, url, token)
			.then(() => {
				refreshBlogs()
				setNotification(
					`Added a new blog ${title} by ${author}`,
					NotificationState.Success
				)
			})
			.catch((error) => {
				if (error.response) {
					setNotification(error.response.data.error, NotificationState.Error)
				}
			})
	}

	const updateLikes = (blogID, likes) => {
		blogService
			.put({ likes }, blogID, token)
			.then(() => {
				refreshBlogs()
			})
			.catch((error) => {
				setNotification(
					"Error liking blog: " + error.response.data.error,
					NotificationState.Error
				)
			})
	}

	const removeBlog = () => {
		blogService
			.del(blogID, token)
			.then(() => {
				setNotification(
					`Deleted ${blogName} by ${blogAuthor}`,
					NotificationState.Success
				)
				refreshBlogs()
			})
			.catch((error) => {
				setNotification(
					"Error deleting blog: " + error.response.data.error,
					NotificationState.Error
				)
			})
		refreshBlogs()
	}

	const logout = (event) => {
		event.preventDefault()
		setUser(null)
		setToken(null)
	}

	return (
		<Container>
			<Notification message={message} state={state} />

			{user === null ? (
				<LoginForm onSubmit={login} destroy={destroyInput} />
			) : (
				[
					<Slide direction="left" in={loginSlide} timeout={1000}>
						<div>
							<Dialog
								open={openConfirmation}
								onClose={() => setOpenConfirmation(false)}
								aria-labelledby="alert-dialog-title"
								aria-describedby="alert-dialog-description"
							>
								<DialogTitle id="alert-dialog-title">
									{"Delete Confirmation"}
								</DialogTitle>
								<DialogContent>
									<DialogContentText id="alert-dialog-description">
										Really delete {blogName} by {blogAuthor}?
									</DialogContentText>
								</DialogContent>
								<DialogActions>
									<Button onClick={() => setOpenConfirmation(false)}>
										Cancel
									</Button>
									<Button
										onClick={() => {
											removeBlog()
											setOpenConfirmation(false)
										}}
										autoFocus
									>
										Delete
									</Button>
								</DialogActions>
							</Dialog>

							<Button
								onClick={() => {
									setBlogSubmitFormOpen(true)
								}}
							>
								Submit new blog
							</Button>
							<BlogSubmitForm
								blogSubmitFormOpen={blogSubmitFormOpen}
								setBlogSubmitFormOpen={setBlogSubmitFormOpen}
								onSubmit={submitBlog}
							/>

							<Box sx={{ ml: "100%" }}>
								<Button
									onClick={(e) => {
										setLoginSlide(false)
										setTimeout((e) => logout(e), 2000, e)
									}}
									id="logoutbutton"
									variant="outlined"
									sx={{ transform: "translate(-100%,0%)" }}
								>
									Logout
								</Button>
							</Box>
							<Typography variant="h6" component="div">
								Blogs
							</Typography>
							<List dense={true}>
								{_.sortBy(blogs, "likes")
									.reverse()
									.map((blog) => (
										<Blog
											key={blog.id}
											blog={blog}
											onLike={updateLikes}
											removeBlog={(id, title, author) => {
												setOpenConfirmation(true)
												setID(id)
												setTitle(title)
												setAuthor(author)
											}}
											username={user.username}
										/>
									))}
							</List>
						</div>
					</Slide>,
				]
			)}
		</Container>
	)
}

export default App
