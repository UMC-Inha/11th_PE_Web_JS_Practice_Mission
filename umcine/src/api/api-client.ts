import ky from "ky";
import { env } from "../config/env";

const baseUrl = env.apiBaseUrl.trim();

export const apiClient = ky.create({
  baseUrl: baseUrl && !baseUrl.endsWith("/") ? `${baseUrl}/` : baseUrl,
});