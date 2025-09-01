// ***********************************************
// This file contains custom Cypress commands
// that can be used across all test files.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to wait for the page to load completely
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible')
  cy.window().should('have.property', 'location')
})

// Custom command to check if element exists and is visible
Cypress.Commands.add('shouldBeVisibleAndExist', (selector: string) => {
  cy.get(selector).should('exist').and('be.visible')
})

// Prevent TypeScript errors
export {}
