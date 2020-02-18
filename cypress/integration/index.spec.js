describe( 'Landing Page', () => {
  const url = Cypress.env('baseUrl')

  it( 'Show landingContainer', () => {
    cy.clearLocalStorage()
    cy.visit( `${url}/` )
    cy.get('#landingContainer')
      .should( 'not.have.class', 'hidden' )
  } )

  it( 'Hide landingContainer', () => {
    cy.visit( `${url}/signin` )
    cy.get('#landingContainer')
      .should( 'have.class', 'hidden' )
  } )

  it( 'Show reactContainer', () => {
    cy.visit( `${url}/signin` )
    cy.get('#reactContainer')
    .should('not.have.class', 'hidden')
  } )

  it( 'Hide reactContainer', () => {
    cy.clearLocalStorage()
    cy.visit( `${url}/` )
    cy.get('#reactContainer')
    .should('have.class', 'hidden')
  } )






})