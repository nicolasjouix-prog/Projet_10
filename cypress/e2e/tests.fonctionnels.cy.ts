import { apiRequest, nettoyerPanier, identifiant } from "../support/api-helper";

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
  beforeEach(() => {
    const {username, password} = identifiant();
    cy.loginByApi(username, password).then(() => {
      nettoyerPanier();
    });
  });
  
  it('Ajout d\'un produit en stock au panier et décompte son stock', () => {
    /* Lire le stock initial */
    cy.visit('/#/products/6')    
    cy.get('[data-cy="detail-product-stock"]').should('be.visible').invoke('text').should('match', /-?\d+/).then((texte) => {
      const matches = texte.match(/-?\d+/);
      const stockInitial = Number(matches![0]);
      cy.log('Le stock est de :', stockInitial);
      cy.wrap(stockInitial).as('valeurStock');
    });
    /* Lire la quantité à ajouter */
    cy.get('@valeurStock').then((stockInitial) => {
      expect(stockInitial, 'précondition : stock suffisant').to.be.gt(1);
      cy.get('[formcontrolname="quantity"]').should('be.visible').invoke('val').should('not.be.empty').then((valeur) => {
      const valeurAjoute = Number(valeur);
      cy.log('Quantité à ajouter :', valeurAjoute);
      cy.wrap(valeurAjoute).as('produitAjoute');
    });
    /* Ajouter le produit */ 
      cy.intercept('PUT', '/orders/add').as('ajoutPanier');
      cy.get('[data-cy="detail-product-add"]').should('be.visible').click();
      cy.wait('@ajoutPanier').its('response.statusCode').should('eq', 200);
      /* Vérifier sa présence dans le panier */
      cy.contains("Dans la forêt").should('be.visible');
      /* Vérifier le stock après ajout */
      cy.visit('/#/products/6');
      cy.get('[data-cy="detail-product-stock"]').should('be.visible').invoke('text').should('match', /-?\d+/).then((texte) => {
        const match = texte.match(/-?\d+/);        
        const stockApres = Number(match![0]);
        cy.wrap(stockApres).as('stockFinal');
      cy.get('@valeurStock').then((stockInitial) => {
        cy.get('@produitAjoute').then((valeurAjoute) => {
          cy.get('@stockFinal').then((stockApres) => {
          const stockAttendu = Number(stockInitial) - Number(valeurAjoute);
          expect(stockApres).to.eq(stockAttendu);
          });
        });
      });
      });
    });
  });
  it('Ajout d\'un produit avec une valeur négative', () => {
  cy.visit('/#/products/6');
  cy.get('[formcontrolname="quantity"]').should('be.visible').clear().type("-1").should('have.value', '-1').should('have.class', 'ng-invalid');
  cy.get('[data-cy="detail-product-add"]').should('be.visible').click();
  cy.get('[formcontrolname="quantity"]').should('have.class', 'ng-invalid');
});
  it('Ajout d\'un produit avec une valeur supérieure à 20', () => {
  const valeur = "21";
  cy.visit('/#/products/6');
  cy.get('[formcontrolname="quantity"]').should('be.visible').clear().type(valeur).should('have.value', valeur);
  cy.get('[data-cy="detail-product-add"]').should('be.visible').click();
  cy.get('[formcontrolname="quantity"]').should('have.class', 'ng-invalid');
  cy.url().should('not.include', '/#/cart');
});
it('Ajout d\'un produit au panier et contrôle du panier via l\'API', () => {
  const valeur = '1';
  cy.visit('/#/products/6');
  cy.get('[formcontrolname="quantity"]').should('be.visible').clear().type(valeur).should('have.value', valeur);
  cy.intercept('PUT', '/orders/add').as('ajoutPanier');
  cy.get('[data-cy="detail-product-add"]').should('be.visible').click();
  cy.wait('@ajoutPanier').its('response.statusCode').should('eq', 200);
  apiRequest('GET', '/orders').then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body.orderLines).to.be.an('array');
    const produit = response.body.orderLines.find((ligne: any) => ligne.product.id === 6);
    expect(produit, 'Produit "Dans la forêt" présent dans le panier').to.exist;
    expect(produit.quantity, 'Quantité du produit dans le panier').to.eq(1);
  });
});
  it('Vérification de la présence du champ de disponibilité du produit', () => {
  cy.visit('/#/products/6');
  cy.get('[data-cy="detail-product-stock"]').should('be.visible').and('not.be.empty').invoke('text').should('match', /-?\d+/);
  });
});
