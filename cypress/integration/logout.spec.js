describe('c0d3.com', () => {
  it('Sign out home', () => {
    cy.login()
    cy.logout()
  })
})
