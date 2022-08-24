// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('addTestingUser', ()=> {
	const user = {
		name: 'Testing person',
		username: 'Testing user',
		password: 'Testing password'
	}
	
	cy.request('POST', 'http://localhost:3003/api/users/', user)
	}
)

Cypress.Commands.add('loginTestingUser', () => {
	cy.request('POST', 'http://localhost:3003/api/login/', {username:"Testing user", password:"Testing password"}).then( (response) => {
        localStorage.setItem('user', JSON.stringify(response.body))
	})
})

Cypress.Commands.add('createTestingBlog', (index)=>{
	const blogs = [{
		title: 'What we owe to each other',
		author: 'T. M. Scanlon',
		url: 'https://www.jstor.org/stable/j.ctv134vmrn'
	},{
		title: 'Manufacturing Consent: The Political Economy of the Mass Media',
		author: 'Edward S. Herman and Noam Chomsky',
		url: 'https://doi.org/10.1177/1742766510373714'
	},{
		title: 'Der Witz und seine Beziehung zum Unbewußten',
		author: 'Sigmund Freud',
		url: 'https://wwnorton.com/books/9780393001457'
	}]

	cy.request({
		url: 'http://localhost:3003/api/blogs/',
		method: 'POST',
		body: blogs[index],
		headers: {
			'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`
		}
	})

	cy.reload()
	cy.contains("What we owe to each other by T. M. Scanlon")
})