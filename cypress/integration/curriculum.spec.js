/* global cy Cypress describe it */
describe('c0d3.com', () => {
  it('able to reach curriculum page', () => {
    cy.login()

    cy.contains(/^curriculum$/i).click()

    cy.url().should('include', '/curriculum')

    cy.get('.gs-container-1')
      .find('.btn-success')
      .click()

    cy.url().should('include', '/student')
  })
})
