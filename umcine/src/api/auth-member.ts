import type { Options } from "ky";
import { apiClient } from "./api-client";
import { env } from "../config/env";
import { useAuthStore } from "../stores/auth-store";
import type { AuthSession } from "../stores/auth-store";

const REQUEST_TIMEOUT_MS = 10_000;

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface MemberInfo {
  email: string;
  nickname: string;
  createdAt: string;
}

export class MemberApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, status: number, code = "") {
    super(message);
    this.name = "MemberApiError";
    this.status = status;
    this.code = code;
  }
}

async function request<T>(
  path: string,
  options: Omit<Options, "headers" | "timeout">,
  session?: AuthSession,
) {
  if (!env.apiBaseUrl) {
    throw new Error("VITE_API_BASE_URL에 백엔드 주소를 설정해 주세요.");
  }

  const headers = new Headers();

  if (session) {
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  }

  const controller = new AbortController();
  const signal = options.signal;
  const handleAbort = () => controller.abort(signal?.reason);

  if (signal?.aborted) {
    handleAbort();
  } else {
    signal?.addEventListener("abort", handleAbort, { once: true });
  }

  const timer = setTimeout(() => {
    controller.abort(
      new DOMException(
        "서버 응답이 지연되고 있어요. 잠시 후 다시 시도해 주세요.",
        "TimeoutError",
      ),
    );
  }, REQUEST_TIMEOUT_MS);

  try {
    controller.signal.throwIfAborted();

    let response: Response;

    try {
      response = await apiClient(path, {
        ...options,
        headers,
        signal: controller.signal,
        timeout: false,
        retry: 0,
        throwHttpErrors: false,
      });
    } catch (error) {
      controller.signal.throwIfAborted();

      throw new Error(
        "서버에 연결하지 못했어요. 백엔드 실행 상태와 주소를 확인해 주세요.",
        { cause: error },
      );
    }

    const data = await response.json().catch(() => {
      controller.signal.throwIfAborted();
      return null;
    });

    controller.signal.throwIfAborted();

    if (!response.ok || data?.isSuccess === false) {
      const message =
        typeof data?.message === "string"
          ? data.message
          : `요청에 실패했어요. (${response.status})`;

      if (
        response.status === 401 &&
        session &&
        session.id === useAuthStore.getState().session?.id
      ) {
        useAuthStore.getState().signOut(message);
      }

      throw new MemberApiError(message, response.status, data?.code ?? "");
    }

    if (data === null) {
      throw new Error("서버 응답을 확인할 수 없어요.");
    }

    return data as T;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", handleAbort);
  }
}

function unwrap<T>(response: ApiResponse<T>) {
  if (response.isSuccess !== true || response.result == null) {
    throw new Error("서버 응답 형식이 올바르지 않아요.");
  }

  return response.result;
}

export async function login(
  email: string,
  password: string,
  signal?: AbortSignal,
) {
  const response = await request<
    ApiResponse<{
      nickname: string;
      accessToken: string;
    }>
  >("auth/login", {
    method: "post",
    signal,
    json: {
      email: email.trim(),
      password,
    },
  });

  const result = unwrap(response);

  if (!result.accessToken) {
    throw new Error("로그인 응답에 토큰이 없어요.");
  }

  return result;
}

export async function getMyInfo(session: AuthSession, signal?: AbortSignal) {
  return unwrap(
    await request<ApiResponse<MemberInfo>>("members/me", { signal }, session),
  );
}

export async function updateMyInfo(session: AuthSession, nickname: string) {
  return unwrap(
    await request<ApiResponse<MemberInfo>>(
      "members/me",
      {
        method: "patch",
        json: {
          nickname: nickname.trim(),
        },
      },
      session,
    ),
  );
}

export function checkNicknameAvailability(nickname: string) {
  return request<{ available: boolean }>(
    `members/nickname/${encodeURIComponent(nickname.trim())}`,
    {},
  );
}

export const myInfoQueryKey = (sessionId: string | undefined) =>
  ["member", "me", sessionId] as const;