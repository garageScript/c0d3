/* global cy Cypress */
describe('Profile', () => {
  before(() => {
    cy.login()
    cy.profile()
  })
  it('Checking Settings Link', () => {
    cy.get('.md-pills').find('.nav-item').last().click()
    cy.get('.md-pills').find('.active').should('have.text', 'Settings')
  })
  it('Checking MR Contributions', () => {
    cy.get('.md-pills').find('.nav-item').last().prev().click()
    cy.get('.md-pills').find('.active').should('have.text', 'MR Contributions')
  })
})
