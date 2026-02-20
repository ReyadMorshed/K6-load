import http from 'k6/http';

const BASE_URL = 'https://petstore.swagger.io/v2';

export class StoreAPI {
  /**
   * Returns a map of status codes to quantities
   * GET /store/inventory
   */
  static getInventory() {
    return http.get(`${BASE_URL}/store/inventory`, {
      headers: { 'Accept': 'application/json' },
    });
  }

  /**
   * Place an order for a pet
   * POST /store/order
   */
  static placeOrder(petId: number, quantity: number) {
    const payload = JSON.stringify({
      petId: petId,
      quantity: quantity,
      shipDate: new Date().toISOString(),
      status: 'placed',
      complete: true,
    });

    return http.post(`${BASE_URL}/store/order`, payload, {
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json' 
      },
    });
  }

  /**
   * Find purchase order by ID
   * GET /store/order/{orderId}
   */
  static getOrderById(orderId: number) {
    return http.get(`${BASE_URL}/store/order/${orderId}`);
  }

  /**
   * Delete purchase order by ID
   * DELETE /store/order/{orderId}
   */
  static deleteOrder(orderId: number) {
    return http.del(`${BASE_URL}/store/order/${orderId}`);
  }
}