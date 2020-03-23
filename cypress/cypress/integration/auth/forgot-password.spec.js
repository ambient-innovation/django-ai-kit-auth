/**
 * This tests the forgot password form with usual flow
 */
describe('Forgot password', function () {
  const forgotPasswordPage = '/auth/forgot-password';
  const username = `user${Date.now() % 65536}`;
  const email = `${username}@example.com`;

  const fillOutEmail = (email) => {
    cy.get('input[id="forgot_email"]')
    .type(email)
    .should('have.value', email);

    cy.get('button[id=forgot_submit]').click();
  };

  it('shows email sent message after submitting a form', () => {
    cy.visit(forgotPasswordPage);
    fillOutEmail(email);
    cy.contains('Email Sent').should('not.be.empty');
  });
});
