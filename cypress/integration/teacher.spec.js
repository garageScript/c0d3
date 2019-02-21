/* global cy Cypress */
describe('Teacher Page', () => {
  before(() => {
    cy.login()
    cy.curriculum()
    cy.teacher()
  })
  it('Check to see Teacher Page', () => {
    cy.get('.col-7').find('h4').should('have.text', 'Submissions')
    cy.get('.col-5').find('h4').should('have.text', 'Student Progress')
  })
})
