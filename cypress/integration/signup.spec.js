/* global cy Cypress */
describe('c0d3.com', () => {
  it('sign up flow', () => {
    cy.server()
    const name = "John Doe"
    const username = "tsiersidj"
    const email = "johndoe@c0d3.com"
    const password = "letmein2"
    const url = Cypress.env('baseUrl')
    const route = '/landing.html'
    cy.visit(`${url}${route}`)
    cy.route(`${url}/**`).as('login')
    cy.contains('Log In').click()
    cy.wait('@login').then((xhr)=>{
      expect(xhr.status).to.equal(200)
    })
    cy.request(`${url}/signin`).then((response) => {
      expect(response.status).to.eq(200)
    })
    cy.url().should('include', '/signin')
    cy.contains('Sign Up').click()
    cy.url().should('include', '/signup')
    cy.request(`/signup`).then((response) => {
      expect(response.status).to.eq(200)
    })
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
      .each((num, index, arr)=>{
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
