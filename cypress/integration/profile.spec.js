/* global cy Cypress */
describe('Profile', () => {
  before(() => {
    cy.login()
    cy.profile()
  } )
  it('Visit the profile page', () => {
    cy.url().should('include', '/profile/bot')
  })
  it( 'Checking Curriculum Progress Card', () => {
    cy.get('.testimonial-card').contains('Foundations of JavaScript')
    cy.get('.card-body').contains('Variables & Functions')
    cy.get('.card-title').contains('General Algorithms')
  } )
})
