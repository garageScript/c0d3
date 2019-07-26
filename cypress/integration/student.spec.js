const TWO_SECOND = 2000
describe( 'student', () => {
  before(()=>{
    cy.login()
    cy.curriculum()
    cy.student()
  })

  it('check if mr exists if highlighted', ()=>{
    cy.url().should( 'include', '/student' )
    cy.wait(TWO_SECOND)
    cy.get('.pagination').find('.page-item').first().next().click()
    cy.get('.pagination').find('.page-item').should('have.class', 'active')
  })
})
