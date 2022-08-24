import PropTypes from "prop-types"
import React from "react"

const LoginForm = (props) => {
	return (
		<>
			<h2>Login</h2>
			<form onSubmit={props.onSubmit}>
				<div> Username <input type="text" name="username" id="username"/> </div>
				<div> Password <input type="password" name="password" id="password"/> </div>
				<button type="submit" id="loginbutton">Login</button>
			</form>
		</>
	)
}

LoginForm.propTypes = {
	onSubmit: PropTypes.func.isRequired
}

export default LoginForm