// ***********************************************************
// This file is used to load Cypress support commands
// and configure or extend the test runner.
//
// You can import Cypress commands from the commands file:
// import './commands'
//
// Alternatively you can use CommonJS syntax:
// require('./commands')
// ***********************************************************

import './commands'

// Disable screenshot and video on run
Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
})

// Add custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to wait for the page to load completely
       */
      waitForPageLoad(): Chainable<void>
      
      /**
       * Custom command to check if element exists and is visible
       */
      shouldBeVisibleAndExist(selector: string): Chainable<void>
    }
  }
}
