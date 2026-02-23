import { check, group, sleep } from "k6";
import { Options } from "k6/options";
import { PetAPI } from "./lib/pet";
import { StoreAPI } from "./lib/store";
import { UserAPI } from "./lib/user";

export const options: Options = {
  stages: [
    { duration: "30s", target: 10 },
    { duration: "1m", target: 10 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"],
    http_req_failed: ["rate<0.01"],
  },
};

export default function () {
  const id = Math.floor(Math.random() * 1000000);
  const username = `k6_user_${id}`;

  // --- 1. USER GROUP ---
  group("User API Operations", () => {
    check(UserAPI.createUser({ id, username }), {
      "user: created": (r) => r.status === 200,
    });
    check(
      UserAPI.createWithArray([{ id: id + 1, username: `${username}_alt` }]),
      { "user: array created": (r) => r.status === 200 },
    );
    check(UserAPI.login(username, "password123"), {
      "user: login success": (r) => r.status === 200,
    });
    check(UserAPI.getUser(username), {
      "user: retrieved": (r) => r.status === 200,
    });
    check(UserAPI.updateUser(username, { firstName: "Updated" }), {
      "user: updated": (r) => r.status === 200,
    });
    check(UserAPI.logout(), {
      "user: logout success": (r) => r.status === 200,
    });
    check(UserAPI.deleteUser(username), {
      "user: deleted": (r) => r.status === 200,
    });
  });

  // --- 2. PET GROUP ---
  group("Pet API Operations", () => {
    check(PetAPI.addPet({ id, name: "Tester", status: "available" }), {
      "pet: added": (r) => r.status === 200,
    });
    check(PetAPI.updatePet({ id, name: "TesterV2", status: "pending" }), {
      "pet: updated": (r) => r.status === 200,
    });

    const findRes = PetAPI.findByStatus("available");
    check(findRes, {
      "pet: findByStatus 200": (r) => r.status === 200,
      "pet: list not empty": (r) => {
        const body = r.json();
        return Array.isArray(body) && (body as any[]).length > 0;
      },
    });

    check(PetAPI.findByTags(["tag1"]), {
      "pet: findByTags 200": (r) => r.status === 200,
    });
    check(PetAPI.getPetById(id), {
      "pet: retrieved by id": (r) => r.status === 200,
    });
    check(PetAPI.updatePetWithFormData(id, "NewName", "sold"), {
      "pet: form update 200": (r) => r.status === 200,
    });
    check(PetAPI.deletePet(id), { "pet: deleted": (r) => r.status === 200 });
  });

  // --- 3. STORE GROUP ---
  group("Store API Operations", () => {
    check(StoreAPI.getInventory(), {
      "store: inventory 200": (r) => r.status === 200,
    });

    const orderRes = StoreAPI.placeOrder({
      id,
      petId: id,
      quantity: 1,
      status: "placed",
    });
    const orderData = orderRes.json() as any;
    check(orderRes, {
      "store: order placed": (r) => r.status === 200,
      "store: order ID valid": () => orderData && orderData.id !== undefined,
    });

    if (orderData && orderData.id) {
      check(StoreAPI.getOrderById(orderData.id), {
        "store: order retrieved": (r) => r.status === 200,
      });
      check(StoreAPI.deleteOrder(orderData.id), {
        "store: order deleted": (r) => r.status === 200,
      });
    }
  });

  sleep(1);
}
