import ky from "ky";
import { assertApiConfigured, env } from "../config/env";

export const apiClient = ky.create({
  baseUrl: env.apiBaseUrl,
  hooks: { init: [assertApiConfigured] },
});
