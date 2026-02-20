import http from 'k6/http';
const BASE_URL = 'https://petstore.swagger.io/v2';

export class PetAPI {
  static addPet(body: object) {
    return http.post(`${BASE_URL}/pet`, JSON.stringify(body), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  static findByStatus(status: string) {
    return http.get(`${BASE_URL}/pet/findByStatus?status=${status}`);
  }

  static getPetById(id: number) {
    return http.get(`${BASE_URL}/pet/${id}`);
  }
}