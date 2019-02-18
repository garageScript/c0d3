/* global cy Cypress */
describe('c0d3.com', ()=>{
	it('Chat page loading', ()=>{
		cy.login()
		cy.chat()
        })
})
