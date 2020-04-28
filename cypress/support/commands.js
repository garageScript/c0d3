/* global cy Cypress expect */

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (name = 'bot', password = 'letmein1') => {
  const url = Cypress.env('baseUrl')
  const route = '/'
  cy.visit(`${url}${route}`)

  cy.contains(/^log in$/i).click()

  cy.url().should('include', '/signin')

  cy.get('#signin-user-name')
    .type(name)
    .should('have.value', name)

  cy.get('#signin-password')
    .type(password)
    .should('have.value', password)

  cy.server()
  cy.route('POST', '*signin').as('signin')
  cy.get('form').submit()
  cy.wait('@signin')

  cy.getCookies().then(cookies => {
    expect(cookies.length).to.be.greaterThan(0)
  })
})

Cypress.Commands.add('chat', () => {
  const url = Cypress.env('baseUrl')
  cy.contains('Chat').click()
  cy.url().should('include', '/chat')
})

Cypress.Commands.add('profile', () => {
  const url = Cypress.env('baseUrl')
  cy.contains('Profile').click()
})

Cypress.Commands.add('curriculum', () => {
  const url = Cypress.env( 'baseUrl' )
  cy.contains('Curriculum').click()
  cy.url().should('include', '/curriculum')
})

Cypress.Commands.add('teacher', () => {
  const url = Cypress.env('baseUrl')
  cy.get('.card-body').find('a').contains('Review student submissions').first().click()
  cy.url().should('include', '/teacher')
})

Cypress.Commands.add('student', () => {
  cy.get('.card-body').find('a').contains('Continue').first().click()
})

Cypress.Commands.add('logout', () => {
  const url = Cypress.env('baseUrl')

  cy.server()
  cy.route('/signout').as('signout')
  cy.contains(/^Tools$/i).click()
  cy.contains('Sign Out').click()
  cy.wait('@signout')

  cy.visit(`${url}/curriculum`)
  cy.url().should('include', '/signin')
})
