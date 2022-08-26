import axios from "axios"
const baseUrl = "/api/blogs"

const getAll = () => {
	const request = axios.get(baseUrl)
	return request.then((response) => response.data)
}

const post = (title, author, url, token) => {
	const request = axios.post(
		baseUrl,
		{ title, author, url },
		{ headers: { Authorization: `Bearer ${token}` } }
	)
	return request.then((response) => response.data)
}

const put = (newdata, blogID, token) => {
	const request = axios.put(baseUrl + `/${blogID}`, newdata, {
		headers: { Authorization: `Bearer ${token}` },
	})
	return request.then((response) => response.data)
}

const del = (blogID, token) => {
	const request = axios.delete(baseUrl + `/${blogID}`, {
		headers: { Authorization: `Bearer ${token}` },
	})
	return request.then((response) => response.data)
}

export default { getAll, post, put, del }
