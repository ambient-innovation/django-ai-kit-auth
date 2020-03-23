/**
 * This tests the reset password form with usual flow
 */
describe('Rest password and password validation', function () {
  // we need a real ident to do password validation
  const { ident } = Cypress.config().users['root'];
  const resetPasswordPage = `/auth/reset-password/${ident}/1234-4563`;

  const fillOutForm = (password, password2 = '', submit = false) => {
    password !== '' && cy.get('input[id="reset_password"]')
    .clear()
    .type(password)
    .should('have.value', password);

    password2 !== '' && cy.get('input[id="reset_password2"]')
    .clear()
    .type(password2)
    .should('have.value', password2);

    submit && cy.get('button[id=reset_submit]').click();
  };

  // These will trigger race conditions as long as there is no debounce for the password validation

  /*it('should show an error message when the entered password is too short', () => {
    cy.visit(resetPasswordPage);
    fillOutForm('opiopdi');
    cy.get('.Mui-error').should('have.lengthOf.above', 0);
  });

  it('should show an error message when the entered password is too similar to the username/email', () => {
    cy.visit(resetPasswordPage);
    fillOutForm('root@example.com');
    cy.get('.Mui-error').should('have.lengthOf.above', 0);
  });*/

  it('should show an error message when the entered passwords are not identical', () => {
    cy.visit(resetPasswordPage);
    fillOutForm('okidoki1', 'okidoki2');
    cy.get('input[id="reset_password2"]').parent().get('.Mui-error').should('have.lengthOf.above', 0);
  });

  it('should show an error page when the token is not valid', () => {
    cy.visit(resetPasswordPage);
    fillOutForm('okidoki1', 'okidoki1', true);
    cy.get('a[href="/auth/forgot-password"]').should('have.length', 1);
  });

  // TODO: find a way to get a valid token and test the success message appearing
});
