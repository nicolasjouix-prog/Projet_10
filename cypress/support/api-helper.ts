import { authToken } from './commands.js';

const API_BASE_URL = 'http://localhost:8081';

export const apiRequest = (method: string, endpoint: string, body?: any) => {
  return cy.request({
    method: method,
    url: `${API_BASE_URL}${endpoint}`,
    headers: { authorization: `Bearer ${authToken()}` },
    body: body,
    failOnStatusCode: false,
  });
};

export const nettoyerPanier = () => {
  apiRequest('GET', '/orders').then((response) => {
    const lines = response.body?.orderLines ?? [];
    lines.forEach((line: { id: number }) => {
      apiRequest('DELETE', `/orders/${line.id}/delete`).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(200);
      });
    });
  });
};