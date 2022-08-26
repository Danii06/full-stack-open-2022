import React from "react"
import PropTypes from "prop-types"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import { TextField } from "@mui/material"
import { Button } from "@mui/material"
import { useState } from "react"

const BlogSubmitForm = (props) => {
	const [author, setAuthor] = useState("")
	const [title, setTitle] = useState("")
	const [URL, setURL] = useState("")
	return (
		<Dialog
			open={props.blogSubmitFormOpen}
			onClose={() => {
				props.setBlogSubmitFormOpen(false)
			}}
		>
			<DialogTitle>Add new blog</DialogTitle>
			<DialogContent>
				<TextField
					autoFocus
					margin="dense"
					id="title"
					label="Blog Title"
					type="text"
					fullWidth
					variant="standard"
					onChange={(e) => setTitle(e.target.value)}
				/>
				<TextField
					autoFocus
					margin="dense"
					id="author"
					label="Blog Author"
					type="text"
					fullWidth
					variant="standard"
					onChange={(e) => setAuthor(e.target.value)}
				/>
				<TextField
					autoFocus
					margin="dense"
					id="name"
					label="Blog URL"
					type="text"
					fullWidth
					variant="standard"
					onChange={(e) => setURL(e.target.value)}
				/>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={() => {
						props.setBlogSubmitFormOpen(false)
					}}
				>
					Cancel
				</Button>
				<Button
					onClick={(e) => {
						props.onSubmit(e, title, author, URL)
						props.setBlogSubmitFormOpen(false)
					}}
				>
					Add
				</Button>
			</DialogActions>
		</Dialog>
	)
}
{
	/* <> */
}
{
	/* <h2>Submit a blog</h2>
<form onSubmit={props.onSubmit}>
	<div>
		{" "}
		Title: <input type="text" name="title" id="title" />{" "}
	</div>
	<div>
		{" "}
		Author: <input type="text" name="author" id="author" />{" "}
	</div>
	<div>
		{" "}
		URL: <input type="text" name="url" id="URL" />{" "}
	</div>
	<button type="Submit" id="Submit">
		Submit
	</button>
</form>
</> */
}
BlogSubmitForm.propTypes = {
	onSubmit: PropTypes.func.isRequired,
}

export default BlogSubmitForm
