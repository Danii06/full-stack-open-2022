import PropTypes from "prop-types"
import { React, useState } from "react"
import {
	IconButton,
	ListItemIcon,
	ListItemText,
	ListItemButton,
	ListItem,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"
import NotesIcon from "@mui/icons-material/Notes"
import { Typography } from "@mui/material"
// const blogStyle = {
// 	paddingTop: 10,
// 	paddingLeft: 2,
// 	border: "solid",
// 	borderWidth: 1,
// 	marginBottom: 5,
// }

const rightStyle = {
	position: "relative",
	left: "100%",
	transform: "translate(-100%,0%)",
}

const Blog = ({ blog, onLike, removeBlog, username }) => {
	const [secon, setSecon] = useState(false)
	return (
		<div>
			<ListItem
				secondaryAction={
					blog.user.username === username ? (
						<IconButton
							edge="end"
							aria-label="delete"
							onClick={() => removeBlog(blog._id, blog.title, blog.author)}
						>
							<DeleteIcon />
						</IconButton>
					) : null
				}
				id="BlogTitleAuthor"
				className="BlogTitleAuthor"
			>
				<ListItemButton
					sx={{ minWidth: "10px", maxWidth: "30px" }}
					role={undefined}
					onClick={() => onLike(blog._id, blog.likes + 1)}
				>
					<ListItemIcon>
						<ThumbUpIcon edge="start" />
					</ListItemIcon>
					<ListItemText primary={blog.likes} sx={{ ml: "-25px" }} />
				</ListItemButton>

				<ListItemButton
					sx={{ minWidth: "10px", maxWidth: "30px" }}
					role={undefined}
					onClick={() => {
						setSecon(!secon)
					}}
				>
					<ListItemIcon>
						<NotesIcon />
					</ListItemIcon>
				</ListItemButton>

				<a
					href={blog.url}
					target="_blank"
					style={{ "text-decoration": "none" }}
				>
					<ListItemText
						primary={
							<Typography
								type="body2"
								style={{ "text-decoration": "underline" }}
							>
								{blog.title} by {blog.author}
							</Typography>
						}
						secondary={
							secon
								? `Added by: ${blog.user.name}, aka ${blog.user.username} `
								: ""
						}
					/>
				</a>
			</ListItem>
		</div>
	)
}

{
	/* <ListItemButton
					role={undefined}
					onClick={() => onLike(blog._id, blog.likes + 1)}
				>
					<ListItemIcon>
						<ThumbUpIcon edge="start" />
					</ListItemIcon>
				</ListItemButton> */
}
{
	/* secondary={`URL: ${blog.url}\nLikes: {blog.likes}\nAdded by: {blog.user.name}, aka {blog.user.username} `} */
}
{
	/* <Togglable buttonLabel="show" closeButtonLabel="hide">
			<Typography id="BlogExtendedInfo">
				URL: {blog.url} <br />
				Likes: {blog.likes}
				<button
					onClick={() => onLike(blog._id, blog.likes + 1)}
					class="likebutton"
				>
					Like
				</button>
				<br />
				Added by: {blog.user.name}, aka {blog.user.username} <br />
			</Typography>
		</Togglable> */
}

// ;<Grid item xs={12} md={6}>
// 	<Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
// 		Avatar with text and icon
// 	</Typography>
// 	<Demo>
// 		<List dense={dense}>
// 			{generate(
// 				<ListItem
// 					secondaryAction={
// 						<IconButton edge="end" aria-label="delete">
// 							<DeleteIcon />
// 						</IconButton>
// 					}
// 				>
// 					<ListItemAvatar>
// 						<Avatar>
// 							<FolderIcon />
// 						</Avatar>
// 					</ListItemAvatar>
// 					<ListItemText
// 						primary="Single-line item"
// 						secondary={secondary ? "Secondary text" : null}
// 					/>
// 				</ListItem>
// 			)}
// 		</List>
// 	</Demo>
// </Grid>
Blog.propTypes = {
	onLike: PropTypes.func.isRequired,
	removeBlog: PropTypes.func.isRequired,
	username: PropTypes.string.isRequired,
	blog: PropTypes.object.isRequired,
}

export default Blog
