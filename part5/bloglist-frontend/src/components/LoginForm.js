const LoginForm = (props) => {
	return (
		<>
			<h2>Blogs</h2>
			<form onSubmit={props.onSubmit}>
				<div> Username <input type="text" name="username"/> </div>
				<div> Password <input type="password" name="password"/> </div>
				<button type="submit">Login</button>
			</form>
		</>
	)
}

export default LoginForm