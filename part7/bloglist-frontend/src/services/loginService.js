import axios from "axios"
const loginUrl = "/api/login"

const login = (username, password) => {
	const request = axios.post(loginUrl, { username, password })
	return request.then((response) => response.data)
}

export default { login }
