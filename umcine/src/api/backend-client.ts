import ky from "ky";

export const backendClient = ky.create({
  baseUrl: "http://localhost:8080/",
});