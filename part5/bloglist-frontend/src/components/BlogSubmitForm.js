import React from "react"
import PropTypes from "prop-types"

const BlogSubmitForm = (props) => {
	return (
		<>
			<h2>Submit a blog</h2>
			<form onSubmit={props.onSubmit}>
				<div> Title: <input type="text" name="title" id="title"/> </div>
				<div> Author: <input type="text" name="author" id="author"/> </div>
				<div> URL: <input type="text" name="url" id="URL"/> </div>
				<button type="Submit" id="Submit">Submit</button>
			</form>
		</>
	)
}

BlogSubmitForm.propTypes = {
	onSubmit: PropTypes.func.isRequired
}

export default BlogSubmitForm