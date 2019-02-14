/* global cy Cypress */
describe('c0d3.com', () => {
  it('sign up to c0d3', () => {
    const url = Cypress.env('baseUrl');
    const route = '/landing.html'
    cy.visit(`${url}${route}`)
    cy.contains('Log In').click()
    cy.request(`${url}/singin`).then((response) => {
      expect(response.status).to.eq(200)
    })
    cy.url().should('include', '/signin')
    cy.contains('Sign Up').click()
    cy.url().should('include', '/signup')
    cy.request(`${url}/singup`).then((response) => {
      expect(response.status).to.eq(200)
    })
    cy.get('#full-name')
      .type('John Doe')
      .should('have.value', 'John Doe')
    cy.get('#user-name')
      .type('c0d31')
      .should('have.value', 'c0d31')
    cy.get('#email')
      .type('johndoe@c0d3.com')
      .should('have.value', 'johndoe@c0d3.com')
    cy.get('#password-field')
      .type('letmein2')
      .should('have.value', 'letmein2')
    cy.get('#password-confirm')
      .type('monster')
      .should('have.value', 'monster').blur()
    cy.wait(1000)
    cy.get('form').submit()
    cy.request(`${url}/signup`).then((response) => {
      expect(response.status).to.eq(200)
    })
    cy.getCookies().then(cookies => {
      cookies.forEach(cookie => expect(cookie).to.not.be.empty)
    })
  })
})
