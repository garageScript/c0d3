/* global cy Cypress */
const TWO_SECOND = 2000
describe('Teacher Page', () => {
  before(() => {
    cy.login()
    cy.curriculum()
    cy.teacher()
  })
  it( 'Check to see Teacher Page', () => {
    cy.wait(TWO_SECOND)
    cy.get('.btn-group>.btn:first-child:not(:last-child):not(.dropdown-toggle)').should('have.text', 'Student Mode')
    cy.get('.btn-group>.btn:not(:first-child):not(:last-child):not(.dropdown-toggle)').should('have.text', 'Curriculum')
    cy.get('.btn-group>.btn:last-child:not(:first-child), .btn-group>.dropdown-toggle:not(:first-child)').should('have.text', 'Lecture Doc')
    cy.get('.pills-pink .nav-link.active, .pills-pink .show>.nav-link, .tabs-pink').should('have.text', 'View All Students')
    cy.get('#root > div > div > div > div.row.justify-content-center > ul > li:nth-child(2) > a').should('have.text', 'View Adopted Students')
  })
} )