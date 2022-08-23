const BlogSubmitForm = (props) => {
	return (
		<>
			<h2>Submit a blog</h2>
			<form onSubmit={props.onSubmit}>
				<div> Title: <input type="text" name="title"/> </div>
				<div> Author: <input type="text" name="author"/> </div>
				<div> URL: <input type="text" name="url"/> </div>
				<button type="Submit">Submit</button>
			</form>
		</>
	)
}

export default BlogSubmitForm