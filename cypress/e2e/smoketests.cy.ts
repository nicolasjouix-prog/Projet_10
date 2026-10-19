const username = 'test2@test.fr';
const password = 'testtest';

it('Vérifier la présence des champs et boutons de connexion', () => {
  cy.visit('/#/login');
  cy.get('#username').should('be.visible');
  cy.get('#password').should('be.visible');
  cy.get('[data-cy="login-submit"]').should('be.visible');
});

it('Vérifier la présence des boutons d’ajout au panier quand vous êtes connecté', () => {
  cy.loginByApi(username, password);
  cy.visit('/#/products/6');
  cy.get('[data-cy="detail-product-add"]').should('be.visible');
});

it('Faille xss dans la section commentaire', () => {
    const title = `TEST XSS ${Date.now()}`;
    const comment = "<script>alert('XSS_COMMENTAIRE')</script>";
    const stub = cy.stub().as("alerte");
    cy.on('window:alert', stub);

    cy.loginByApi(username, password);
    cy.intercept('POST', '/reviews').as('reqFaille');
    cy.visit('/#/reviews');

    cy.get('[data-cy="review-input-rating-images"]').find('img').eq(2).click({force : true});
    cy.get('[data-cy="review-input-title"]').should('be.visible').type(title);
    cy.get('[data-cy="review-input-comment"]').should('be.visible').type(comment);
    cy.get('[data-cy="review-submit"]').should('be.visible').click();

    cy.wait('@reqFaille').its('response.statusCode').should('eq', 200);
    cy.get('[data-cy="review-detail"]').should('contain', title);
    cy.get('[data-cy="review-detail"]').find('script').should('not.exist');
    cy.get('@alerte').should('not.have.been.called');
});