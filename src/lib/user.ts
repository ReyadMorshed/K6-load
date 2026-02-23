import http from "k6/http";
const BASE_URL = "https://petstore.swagger.io/v2";

export class UserAPI {
  static createUser(user: object) {
    return http.post(`${BASE_URL}/user`, JSON.stringify(user), {
      headers: { "Content-Type": "application/json" },
    });
  }

  static createWithArray(users: object[]) {
    return http.post(
      `${BASE_URL}/user/createWithArray`,
      JSON.stringify(users),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  static createWithList(users: object[]) {
    return http.post(`${BASE_URL}/user/createWithList`, JSON.stringify(users), {
      headers: { "Content-Type": "application/json" },
    });
  }

  static login(user: string, pass: string) {
    return http.get(`${BASE_URL}/user/login?username=${user}&password=${pass}`);
  }

  static logout() {
    return http.get(`${BASE_URL}/user/logout`);
  }

  static getUser(username: string) {
    return http.get(`${BASE_URL}/user/${username}`);
  }

  static updateUser(username: string, body: object) {
    return http.put(`${BASE_URL}/user/${username}`, JSON.stringify(body), {
      headers: { "Content-Type": "application/json" },
    });
  }

  static deleteUser(username: string) {
    return http.del(`${BASE_URL}/user/${username}`);
  }
}
