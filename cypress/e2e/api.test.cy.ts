import { apiRequest, nettoyerPanier } from '../support/api-helper';

const username = 'test2@test.fr';
const password = 'testtest';

it('Récupération du panier sans être connecté', () => {
  apiRequest('GET', '/orders').then((response) => {
    expect(response.status).to.eq(401);
    expect(response.body.message).to.eq('Invalid JWT Token');
  });
});

describe('Authentification API', () => {
  it('Connexion avec des mauvais identifiants', () => {
    apiRequest('POST', '/login', {
      username: username,
      password: 'test',
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.message).to.eq('Invalid credentials.');
  });
});
  it('Connexion avec des bons identifiants', () => {
    apiRequest('POST', '/login', {
      username: username,
      password: password,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.token).to.be.a('string').not.to.empty;
    });
  });
});

describe('Test API avec GET', () => {
  beforeEach("Connexion de l'utilisateur", () => {
    cy.loginByApi(username, password);
  });

  it('Récupération de la liste des produits dans le panier', () => {
  cy.intercept('GET', '/orders').as('getOrders');
  apiRequest('GET', '/orders').then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('orderLines'); 
    expect(response.body.orderLines).to.be.an('array');
    });
  });

  it("Récupération d'une fiche produit spécifique", () => {
    apiRequest('GET', '/products').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array').and.not.be.empty;
      const productId = response.body[0].id;
      apiRequest('GET', `/products/${productId}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.id).to.eq(productId);
        expect(response.body).to.have.property('name');
        expect(response.body).to.have.property('price');
      });
    });
  });
});

describe('Test API avec POST', () => {
  beforeEach("Connexion de l'utilisateur", () => {
    cy.loginByApi(username, password).then(() => {
    nettoyerPanier();
    // cypress est asynchrone, les commandes cy. sont mises en attente. nettoyerPanier() dépend de
    // cy.loginByApi. Il fallait donc l'enchainer avec .then
  });
});
  it("Ajout d'un produit disponible au panier", () => {
    cy.fixture('addDispoArticle').then((addDispoArticle) => {
      apiRequest('PUT' /* modifier le verbe lorsque l'API sera mise à jour */, '/orders/add', addDispoArticle).then((response) => {
        expect(response.status).to.eq(200);
        const line = response.body.orderLines.find((l: any) => l.product.id === addDispoArticle.product);
        expect(line, 'ligne du produit ajouté').to.exist;
        expect(line.quantity).to.be.eq(addDispoArticle.quantity);
      });
    });
  });
  it("Ajout d'un produit indisponible au panier", () => {
    cy.fixture('addIndispoArticle').then((addIndispoArticle) => {
      // Le swagger ne documente que le code 200 pour cette route
      // Un produit en rupture de stock doit être refusé
      // Echec du test: anomalie de l'API
      apiRequest('PUT' /* modifier le verbe lorsque l'API sera mise à jour */, '/orders/add', addIndispoArticle).then((response) => {
        expect(response.status).to.be.within(400, 499); /* modifier avec le code exact */
    });
  });
});
  it("Ajout d'un commentaire", () => {
    cy.fixture('review').then((review) => {
      apiRequest('POST', '/reviews', review).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.comment).to.be.eq(review.comment);
      });
    });
  });
});