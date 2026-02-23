import http from "k6/http";
const BASE_URL = __ENV.BASE_URL || "https://petstore.swagger.io/v2";

export class PetAPI {
  static uploadImage(petId: number, fileData: any) {
    return http.post(`${BASE_URL}/pet/${petId}/uploadImage`, fileData);
  }

  static addPet(body: object) {
    return http.post(`${BASE_URL}/pet`, JSON.stringify(body), {
      headers: { "Content-Type": "application/json" },
    });
  }

  static updatePet(body: object) {
    return http.put(`${BASE_URL}/pet`, JSON.stringify(body), {
      headers: { "Content-Type": "application/json" },
    });
  }

  static findByStatus(status: string) {
    return http.get(`${BASE_URL}/pet/findByStatus?status=${status}`);
  }

  static findByTags(tags: string[]) {
    return http.get(`${BASE_URL}/pet/findByTags?tags=${tags.join(",")}`);
  }

  static getPetById(id: number) {
    return http.get(`${BASE_URL}/pet/${id}`);
  }

  static updatePetWithFormData(petId: number, name: string, status: string) {
    return http.post(`${BASE_URL}/pet/${petId}`, { name, status });
  }

  static deletePet(id: number) {
    return http.del(`${BASE_URL}/pet/${id}`, null, {
      headers: { api_key: "special-key" },
    });
  }
}
