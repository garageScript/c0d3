/* global cy Cypress expect describe it */
describe('c0d3.com', () => {
  it('sign up flow', () => {
    cy.server()
    const name = 'John Doe'
    const username = 'tsiersidj'
    const email = 'johndoe@c0d3.com'
    const password = 'letmein2'
    const url = Cypress.env('baseUrl')
    const serverURL = Cypress.env('serverUrl')
    cy.visit(`${serverURL}/deleteUser?username=${username}`)
    cy.visit(`${url}/signup`)
    cy.get('#full-name')
      .type(name)
      .should('have.value', name)
    cy.get('#user-name')
      .type(username)
      .should('have.value', username)
    cy.get('#email')
      .type(email)
      .should('have.value', email)
    cy.get('#password-field')
      .type(password)
      .should('have.value', password)
    cy.get('#password-confirm')
      .type(password)
      .should('have.value', password).blur()
    cy.wait(1000)
    cy
      .get('.feedback').should('have.length', 5)
      .each((num, index, arr) => {
      	expect(num).to.contain('valid')
      })
    cy.route('POST', '*signup').as('signup')
    cy.get('button[type=submit]').as('submit')
    cy.get('@submit').click()
    cy.wait('@signup').then((xhr) => {
      expect(xhr.status).to.equal(200)
    })
    cy.request(`/`).then((response) => {
      expect(response.status).to.eq(200)
    })
    cy.getCookies().then(cookies => {
      expect(cookies.length).to.be.greaterThan(0)
    })
  })
})
