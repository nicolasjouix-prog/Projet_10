
describe('Test du parcours utilisateur de connexion', () => {
  it('Test du parcours utilisateur de connexion', () => {
    cy.visit('/');
    cy.contains('Connexion').click();
    cy.get('#username').should('be.visible').type('test2@test.fr');
    cy.get('#password').should('be.visible').type('testtest');
    cy.get('[data-cy="login-submit"]').click();
    cy.contains('Mon panier').should('be.visible');
    cy.url().should('not.include', '/login');
  });
});
describe('Tests fonctionnels du panier', () => {
  it('Ajout d\'un produit en rupture de stock au panier', () => {
    cy.visit('/');
    cy.contains('Connexion').click();
    cy.get('#username').should('be.visible').type('test2@test.fr');
    cy.get('#password').should('be.visible').type('testtest');
    cy.get('[data-cy="login-submit"]').click();
    cy.contains('Mon panier').should('be.visible');
    cy.url().should('not.include', '/login');
    cy.get('[data-cy="nav-link-products"]').should('be.visible').click();
    cy.get('[ng-reflect-router-link="/products,3"]').should('be.visible').click();
    /* Récupération du stock avec invoke(text) qui récupère le texte ciblé, should('match'...)
    qui demande d'attendre d'avoir une correspondance en chiffre, l'extraction avec "texte.match",
    convertir la première case du tableau en nombre brut avec number(matches[0])
    vérifier que le stock est inférieur ou égal à 0 aec .to.be.lte(0)*/
    cy.get('[data-cy="detail-product-stock"]').should('be.visible').invoke('text').should('match', /-?\d+/).then((texte) => {
      const matches = texte.match(/-?\d+/);
      const valeurStock = Number(matches![0]); 
      cy.log('Le stock est de :', valeurStock);
      expect(valeurStock, 'précondition : le produit 3 doit être en rupture').to.be.lte(0);      
    });
    cy.intercept('PUT', '/orders/add').as('ajoutPanier');
    cy.get('[data-cy="detail-product-add"]').should('be.visible').click();
    cy.wait('@ajoutPanier').its('response.statusCode').should('be.within', 400, 499);
    cy.url().should('not.include', '/#/cart');
  });
});