/**
 * This tests the registration form with usual flow
 */
describe('Register new user', function () {
  const registerPage = '/auth/register';

  const register = (username, email, password) => {
    cy.get('input[id="register_username"]')
      .type(username)
      .should('have.value', username);

    cy.get('input[id="register_email"]')
      .type(email)
      .should('have.value', email);

    cy.get('input[id="register_password"]')
      .type(password)
      .should('have.value', password);

    cy.get('button[id=register_submit]').click();
  };

  it('displays error message if form was submitted without data', () => {
    cy.visit(registerPage);
    cy.get('button[id=register_submit]').click();
    cy.get('.Mui-error').should('have.lengthOf.above', 1);
  });

  it('shows success message after registration', () => {
    cy.visit(registerPage);
    register('testuser', 'test@example.com', 'longpass');
    cy.contains('Email Sent').should('beInTheDocument');
  });
});
