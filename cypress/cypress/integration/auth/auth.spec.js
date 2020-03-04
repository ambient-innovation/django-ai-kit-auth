
/**
 * Tests the login view
 */

describe('Startpage is shown', () => {
  const page = '/';

  before(() => {
    cy.visit(page);
  });

  it('renders', () => {
    cy.contains('Demo Project').should('have.length', 1);
  });

});
