
describe('When not logged in', () => {

  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:3000')
  })
  
  it('Login form is shown', function() {
    cy.contains('Login')
    cy.get('#username')
    cy.get('#password')
  })

  describe('Login',function() {

    beforeEach(function() {
      cy.request('POST', 'http://localhost:3003/api/testing/reset')
      cy.addTestingUser()
      cy.visit('http://localhost:3000')
    })

    it('succeeds with correct credentials', function() {
      cy.get("#username").type("Testing user")
      cy.get("#password").type("Testing password")
      cy.get("#loginbutton").click()
      cy.get("#logoutbutton")
      cy.get("#loginform").should('not.exist');
    })

    it('fails with wrong credentials', function() {
      cy.get("#username").type("Testing user")
      cy.get("#password").type("Testing incorrect password")
      cy.get("#loginbutton")
      cy.get("#logoutbutton").should('not.exist');
    })
  })
})

describe('When logged in', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.addTestingUser()
    cy.loginTestingUser()
    cy.visit('http://localhost:3000')
  })

  it('A blog can be created', function() {
      cy.contains("Add new blog").click()
      cy.get("#title").type("What we owe to each other")
      cy.get("#author").type("T. M. Scanlon")
      cy.get("#URL").type("https://www.jstor.org/stable/j.ctv134vmrn")
      cy.get("#Submit").click()
      cy.contains("What we owe to each other by T. M. Scanlon")
  })
})

describe('When a blog exists', function(){
  beforeEach(()=>{
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.addTestingUser()
    cy.loginTestingUser()
    cy.createTestingBlog(0)
    cy.visit('http://localhost:3000')
})

it('A blog can be liked', function() {
  cy.contains("show").click()
  cy.contains("Like").click()
  cy.contains("Likes: 1")
})

it('A blog can be deleted', function() {
  cy.contains("Remove").click()
  cy.contains("What we owe to each other by T. M. Scanlon").should('not.exist')
})

it('Blogs are sorted by likes', function() {
  cy.createTestingBlog(1)
  cy.createTestingBlog(2)
  cy.wait(300)
  cy.get(".showbutton").eq(1).click()
  cy.get(".showbutton").eq(2).click()
  cy.get(".showbutton").eq(3).click()
  cy.get(".likebutton").eq(0).as('first')
  cy.get(".likebutton").eq(1).as('second')
  cy.get(".likebutton").eq(2).as('third')
  cy.get("@first").click()
  cy.wait(300)
  cy.get("@first").click()
  cy.wait(300)
  cy.get("@first").click()
  cy.wait(300)
  cy.get("@second").click()
  cy.wait(300)
  cy.get("@third").click()
  cy.wait(300)
  cy.get("@third").click()
  cy.wait(300)
  cy.get(".BlogTitleAuthor").eq(0).contains("Der Witz und seine Beziehung zum Unbewußten by Sigmund Freud")
  cy.get(".BlogTitleAuthor").eq(1).contains("What we owe to each other by T. M. Scanlon")
  cy.get(".BlogTitleAuthor").eq(2).contains("Manufacturing Consent: The Political Economy of the Mass Media by Edward S. Herman and Noam Chomsky")
})

})


