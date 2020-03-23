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

  it('should not be possible to submit without filling out an email', () => {
    cy.visit(forgotPasswordPage);
    cy.get('input[id="forgot_email"]')
    .should('have.attr', 'required');

    cy.get('button[id=forgot_submit]').click();
    cy.get('input[id="forgot_email"]').should('have.length', 1);
  });

  it('shows email sent message after submitting a form', () => {
    cy.visit(forgotPasswordPage);
    fillOutEmail(email);
    cy.contains('Email Sent').should('not.be.empty');
  });
});
