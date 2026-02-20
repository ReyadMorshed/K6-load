import http from 'k6/http';
const BASE_URL = 'https://petstore.swagger.io/v2';

export class UserAPI {
  static createUser(user: object) {
    return http.post(`${BASE_URL}/user`, JSON.stringify(user), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  static login(user: string, pass: string) {
    return http.get(`${BASE_URL}/user/login?username=${user}&password=${pass}`);
  }
}