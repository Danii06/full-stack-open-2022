import React from "react"
import "@testing-library/jest-dom/extend-expect"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Blog from "./Blog"
import BlogSubmitForm from "./BlogSubmitForm"

describe("<Blog>",() => {


	test("Only title and author are shown by default", () => {
		const blog = {
			title: "Title",
			author: "Author",
			url: "URL",
			user: { username: "userUsername", name: "Mr. name" }
		}

		const { container } = render(<Blog blog={blog} onLike={() => {}} removeBlog={() => {}} username={"testing"} />)


		const titleauthor = container.querySelector("#BlogTitleAuthor")
		expect(titleauthor).toHaveTextContent("Title")
		expect(titleauthor).toHaveTextContent("Author")
		expect(titleauthor).not.toHaveStyle("display: none")

		const extendedinfo = container.querySelector("#BlogExtendedInfo")
		expect(extendedinfo).toHaveTextContent("URL")
		expect(extendedinfo).toHaveTextContent("userUsername")
		expect(extendedinfo).toHaveTextContent("Mr. name")
		expect(extendedinfo.parentElement).toHaveStyle("display: none")
	})


	test("URL and likes are shown when show button is clicked", async () => {
		const blog = {
			title: "Title",
			author: "Author",
			url: "URL",
			user: { username: "userUsername", name: "Mr. name" }
		}

		const { container } = render(<Blog blog={blog} onLike={() => {}} removeBlog={() => {}} username={"testing"} />)


		const extendedinfo = container.querySelector("#BlogExtendedInfo")
		expect(extendedinfo).toHaveTextContent("URL")
		expect(extendedinfo).toHaveTextContent("userUsername")
		expect(extendedinfo).toHaveTextContent("Mr. name")
		expect(extendedinfo.parentElement).toHaveStyle("display: none")


		const button = screen.getByText("show")

		const user = userEvent.setup()
		await user.click(button)

		expect(extendedinfo.parentElement).not.toHaveStyle("display: none")

	})

	test("URL and likes are shown when show button is clicked", async () => {
		const blog = {
			title: "Title",
			author: "Author",
			url: "URL",
			user: { username: "userUsername", name: "Mr. name" }
		}


		const mockHandler = jest.fn()

		render(<Blog blog={blog} onLike={mockHandler} removeBlog={() => {}} username={"testing"} />)

		const user = userEvent.setup()

		const show = screen.getByText("show")
		await user.click(show)


		const like = screen.getByText("Like")
		await user.click(like)
		await user.click(like)

		expect(mockHandler.mock.calls).toHaveLength(2)
	})

	test("new blog form sends correct information", async () => {
		const mockHandler = jest.fn()

		const { container } = render(<BlogSubmitForm onSubmit={mockHandler} />)

		const user = userEvent.setup()

		const title = container.querySelector("#title")
		const author = container.querySelector("#author")
		const URL = container.querySelector("#URL")

		await user.type(title, "What we owe to each other")
		await user.type(author, "T. M. Scanlon")
		await user.type(URL, "https://doi.org/10.2307/j.ctv134vmrn")

		const submit = screen.getByText("Submit")
		await user.click(submit)

		const event = mockHandler.mock.calls[0][0]
		const formTitle = event.target.elements.title.value
		const formAuthor = event.target.elements.author.value
		const formURL = event.target.elements.url.value
		expect(formTitle).toEqual("What we owe to each other")
		expect(formAuthor).toEqual("T. M. Scanlon")
		expect(formURL).toEqual("https://doi.org/10.2307/j.ctv134vmrn")
	})
})