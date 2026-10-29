import ky from "ky";
import { env } from "../config/env";

export const springClient = ky.create({
  baseUrl: `${env.apiBaseUrl}/`,
});
