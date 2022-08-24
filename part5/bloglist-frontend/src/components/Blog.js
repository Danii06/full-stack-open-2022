import Togglable from "./Toggleable"
import PropTypes from "prop-types"
import React from "react"

const blogStyle = {
	paddingTop: 10,
	paddingLeft: 2,
	border: "solid",
	borderWidth: 1,
	marginBottom: 5
}

const Blog = ({ blog, onLike, removeBlog, username }) => (
	<div style={blogStyle} id="BlogTitleAuthor" class="BlogTitleAuthor">{blog.title} by {blog.author} <br />
		<Togglable buttonLabel="show" closeButtonLabel="hide">
			<div id="BlogExtendedInfo">
				URL: {blog.url} <br />
				Likes: {blog.likes} <button onClick={() => onLike(blog._id, blog.likes+1)} class="likebutton">Like</button><br />
				Added by: {blog.user.name}, aka {blog.user.username} <br />
			</div>
		</Togglable>
		{blog.user.username===username?<button onClick={() => removeBlog(blog._id, blog.title, blog.author)}>Remove</button>:null}
	</div>
)

Blog.propTypes = {
	onLike: PropTypes.func.isRequired,
	removeBlog: PropTypes.func.isRequired,
	username: PropTypes.string.isRequired,
	blog: PropTypes.object.isRequired
}

export default Blog