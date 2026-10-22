<div align="center">

# OpenClassrooms - Eco-Bliss-Bath
</div>

<p align="center">
    <img src="https://img.shields.io/badge/MariaDB-v11.7.2-blue">
    <img src="https://img.shields.io/badge/Symfony-v6.2-blue">
    <img src="https://img.shields.io/badge/Angular-v13.3.0-blue">
    <img src="https://img.shields.io/badge/docker--build-passing-brightgreen">
  <br><br><br>
</p>

# Prérequis
Pour démarrer cet applicatif web vous devez avoir les outils suivants:
- Docker
- NodeJs

# Installation et démarrage
Clonez le projet pour le récupérer
``` 
git clone https://github.com/OpenClassrooms-Student-Center/Eco-Bliss-Bath-V2.git
cd Eco-Bliss-Bath-V2
```
Pour démarrer l'API avec ça base de données.
```
docker compose up -d
```
# Pour démarrer le frontend de l'applicatif
Rendez-vous dans le dossier frontend
```
cd ./frontend
```
Installez les dépendances du projet
```
npm i
ou
npm install (si vous préférez)
```
# Pour démarrer les tests avec Cypress
Les tests s'exécutent sur l'application démarrée : l'API (http://localhost:8081) et le front (http://localhost:4200) doivent tourner avant de lancer cypress.

Démarrer le front (depuis le dossier 'frontend', dans le terminal qui reste ouvert) :
```
npm start
```
Cloner le dépôt de tests, dans un dossier séparé de l'application :
```
git clone https://github.com/nicolasjouix-prog/Projet_10
cd Projet_10
```
Installer les dépendances :
```
npm i
```
Lancer les tests :
```
npx cypress open
```
## Informations utiles
- Compte de test : 'test2@test.fr' / 'testtest'
- Les tests sont dans 'cypress/e2e/' :
  - 'api.test.cy.ts' : tests API
  - 'smoketests.cy.ts' : smoke tests et test XSS
  - 'tests.fonctionnels.cy.ts' : connexion et panier
- Les tests sont écrits en TypeScript.
- Deux tests échouent volontairement : l'ajout d'un produit en rupture de stock et la limite de 20 articles. Ils révèlent des anomalies de l'application (voir le bilan de campagne).
