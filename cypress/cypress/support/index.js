// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

beforeEach(function () {
  // we have to give the api routes an alias so we can tell cypress to wait for it to respond before continuing.
  cy.server();
  cy.route({
    method: 'GET',
    url: '/api/v1/**',
  }).as('apiCall');
  cy.route({
    method: 'POST',
    url: '/api/v1/**',
  }).as('apiPostCall');
});
