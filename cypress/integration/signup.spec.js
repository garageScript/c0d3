/* global cy Cypress expect describe it */
const NUMBER_OF_FEEDBACK = 5
const HTTP_OK = 200
const ONE_SECOND = 1000

describe( 'c0d3.com', () => {
  const name = 'John Doe'
  const username = 'tsiersidj'
  const email = 'johndoetest@c0d3.com'
  const password = 'letmein2'
  it( 'remove previous test user from server', () => {
    const serverURL = Cypress.env('serverUrl')
    cy.visit(`${serverURL}/deleteUser?username=${username}`)
  } )
  it('sign up flow', () => {
    cy.server()
    const url = Cypress.env('baseUrl')
    cy.visit(`${url}/signup`)
    cy.get('#full-name')
      .type(name)
      .should( 'have.value', name )
    cy.wait(ONE_SECOND)
    cy.get('#user-name')
      .type(username)
      .should( 'have.value', username )
    cy.wait(ONE_SECOND)
    cy.get('#email')
      .type(email)
      .should( 'have.value', email )
    cy.wait(ONE_SECOND)
    cy.get('#password-field')
      .type(password)
      .should( 'have.value', password )
    cy.wait(ONE_SECOND)
    cy.get('#password-confirm')
      .type(password)
      .should('have.value', password).blur()
    cy.wait(ONE_SECOND)
    cy
      .get('.feedback').should('have.length', NUMBER_OF_FEEDBACK)
      .each((num, index, arr) => {
      	expect(num).to.contain('valid')
      })
    cy.route('POST', '*signup').as('signup')
    cy.get('button[type=submit]').as('submit')
    cy.get('@submit').click()
    cy.wait('@signup').then((xhr) => {
      expect(xhr.status).to.equal(HTTP_OK)
    })
    cy.request(`/`).then((response) => {
      expect(response.status).to.eq(HTTP_OK)
    })
    cy.getCookies().then(cookies => {
      expect(cookies.length).to.be.greaterThan(0)
    })
  })
})
