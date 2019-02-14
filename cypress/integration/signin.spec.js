/* global cy Cypress */
describe('c0d3.com', () => {
  it('allows sign in flow', () => {
    const url = Cypress.env('baseUrl')
    const route = '/landing.html'
    cy.visit(`${url}${route}`)

    cy.contains(/^log in$/i).click()

    cy.url().should('include', '/signin')

    cy.get('#signin-user-name')
      .type('bot')
      .should('have.value', 'bot')

    cy.get('#signin-password')
      .type('letmein')
      .should('have.value', 'letmein')

    cy.get('form').submit()

    cy.getCookies().then(cookies => {
      cookies.forEach(cookie => expect(cookie).to.not.be.empty)
    })
  })
})
