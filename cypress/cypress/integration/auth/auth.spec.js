/**
 * This tests the login with the normal email password flow. Do not use this UI login for any tests
 * where the user needs to be logged in. Instead use the login command provided to directly retrieve a token from the
 * api. This UI login should only be tested once.
 */
describe('Login with E-Mail and password', function () {
  /**
   * Convenience function so this code does not need to be called several times below.
   * @param email
   * @param password
   */
  const mainPage = '/';
  const loginPage = '/auth/login';
  const login = (user) => {
    const {ident, password} = Cypress.config().users[user];

    cy.get('input[id="login_userIdentifier"]')
      .type(ident)
      .should('have.value', ident);

    cy.get('input[id="login_password"]')
      .type(password)
      .should('have.value', password);

    cy.get('button[id=login_submit]').should('not.be.disabled').click();
  };

  it('displays error message if form was submitted without data', () => {
    cy.visit(loginPage);
    cy.get('button[id=login_submit]').click();
    cy.get('.Mui-error').should('have.lengthOf.above', 1);
    cy.url().should('eq', `${Cypress.config().baseUrl}${loginPage}`);
  });

   it('should redirect to the dashboard when successfully logged in', () => {
     cy.visit(mainPage);
     cy.url().should('eq', `${Cypress.config().baseUrl}${loginPage}`);
     login('default');
     cy.url().should('eq', `${Cypress.config().baseUrl}${mainPage}`);
   });
});
