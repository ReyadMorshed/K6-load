import http from "k6/http";
const BASE_URL = "https://petstore.swagger.io/v2";

export class StoreAPI {
  static getInventory() {
    return http.get(`${BASE_URL}/store/inventory`, {
      headers: { Accept: "application/json" },
    });
  }

  static placeOrder(body: object) {
    return http.post(`${BASE_URL}/store/order`, JSON.stringify(body), {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  static getOrderById(orderId: number) {
    return http.get(`${BASE_URL}/store/order/${orderId}`, {
      headers: { Accept: "application/json" },
    });
  }

  static deleteOrder(orderId: number) {
    return http.del(`${BASE_URL}/store/order/${orderId}`, null, {
      headers: { Accept: "application/json" },
    });
  }
}
