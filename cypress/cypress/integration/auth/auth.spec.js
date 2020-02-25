
/**
 * Tests the login view
 */

describe('User creates, edits and deletes Location', () => {
  const page = '/';

  before(() => {
    cy.visit(page);
  });

  it('renders', () => {
    cy.contains('Demo Project').should('have.length', 1);
  });

});
