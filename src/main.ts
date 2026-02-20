import { check, group, sleep } from 'k6';
import { Options } from 'k6/options';
// Import your modularized API classes
import { PetAPI } from './lib/pet';
import { StoreAPI } from './lib/store';
import { UserAPI } from './lib/user';

export const options: Options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up
    { duration: '1m', target: 20 },  // Sustained load
    { duration: '30s', target: 0 },  // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must stay under 500ms
    http_req_failed: ['rate<0.01'],   // Error rate must be less than 1%
  },
};

export default function () {
  // Generate unique data for each virtual user (VU) iteration
  const uniqueId = Math.floor(Math.random() * 1000000);
  const username = `k6_user_${__VU}_${uniqueId}`;

  // --- 1. USER GROUP ---
  group('User Operations', () => {
    const createRes = UserAPI.createUser({
      id: uniqueId,
      username: username,
      firstName: 'K6',
      lastName: 'Tester',
      email: `${username}@example.com`,
      password: 'password123'
    });
    
    check(createRes, {
      'user: status is 200': (r) => r.status === 200,
    });

    const loginRes = UserAPI.login(username, 'password123');
    check(loginRes, {
      'user: login successful': (r) => r.status === 200,
    });
  });

  // --- 2. PET GROUP ---
  group('Pet Inventory Search', () => {
    const findRes = PetAPI.findByStatus('available');
    check(findRes, {
  'pet: findByStatus returns 200': (r) => r.status === 200,
  // Cast r.json() to an array to safely access .length
  'pet: inventory is not empty': (r) => Array.isArray(r.json()) && (r.json() as any[]).length > 0,
});
  });

  // --- 3. STORE GROUP ---
  group('Store Transactions', () => {
    // Check inventory levels
    const invRes = StoreAPI.getInventory();
    check(invRes, { 'store: inventory status 200': (r) => r.status === 200 });

    // Place a sample order
    const orderRes = StoreAPI.placeOrder(101, 1); // Ordering Pet ID 101
    const orderId = orderRes.json('id') as number;

    check(orderRes, {
      'store: order placed': (r) => r.status === 200,
      'store: order ID generated': () => orderId !== undefined,
    });

    // Cleanup: Delete the order we just made
    if (orderId) {
      const delRes = StoreAPI.deleteOrder(orderId);
      check(delRes, { 'store: order deleted': (r) => r.status === 200 });
    }
  });

  // Think time: Wait 1 second between iterations to simulate human behavior
  sleep(1);
}