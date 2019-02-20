/* global cy Cypress */
describe('Teacher Page', () => {
  before(() => {
    cy.login()
    cy.curriculum()
    cy.teacher()
  })
  it('Check to see Curriculum Page', () => {
    cy.get('.col-7').find('h4').contains('Submissions')
    cy.get('.col-5').find('h4').contains('Student Progress')
  })
})
