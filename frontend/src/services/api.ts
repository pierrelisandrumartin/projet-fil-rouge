import type {
  AuthResponse,
  ChangePasswordRequest,
  LibraryItem,
  LoginRequest,
  RegisterRequest,
  UserResponse,
  WorkSearchResult,
} from "../types/api";

const API_BASE_URL = "/api";
const TOKEN_KEY = "token";

// --- Token management ---

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// --- Internal HTTP wrapper ---
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}
async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  opts: { skipAuthRedirect?: boolean } = {}
): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    if (!opts.skipAuthRedirect) {
      const wasAuthenticated = getToken() !== null;
      clearToken();
      if (wasAuthenticated) {
        window.location.href = "/login";
      }
    }
    throw new ApiError(response.status, "Unauthorized");
  }

  if (!response.ok) {
    const errorBody = await response.text();
    throw new ApiError(response.status, errorBody);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// --- Public API functions ---

export function login(payload: LoginRequest): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function register(payload: RegisterRequest): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function searchWorks(query: string): Promise<WorkSearchResult[]> {
  const params = new URLSearchParams({ q: query });
  return apiFetch<WorkSearchResult[]>(`/works/search?${params.toString()}`);
}

export function importWork(externalId: string, source: string): Promise<unknown> {
  return apiFetch<unknown>("/works/import", {
    method: "POST",
    body: JSON.stringify({ externalId, source }),
  });
}

export function getMyLibrary(): Promise<LibraryItem[]> {
  return apiFetch<LibraryItem[]>("/works/my");
}

export function updateProgress(
  progressId: number,
  currentVolume: number,
  currentChapter: number
): Promise<unknown> {
  return apiFetch<unknown>(`/progress/${progressId}`, {
    method: "PUT",
    body: JSON.stringify({ currentVolume, currentChapter }),
  });
}

export function removeFromLibrary(progressId: number): Promise<unknown> {
  return apiFetch<unknown>(`/progress/${progressId}`, {
    method: "DELETE",
  });
}

export function getTrending(): Promise<WorkSearchResult[]> {
  return apiFetch<WorkSearchResult[]>("/works/trending");
}

export function getCurrentUser() : Promise<UserResponse> {
  return apiFetch<UserResponse>("/users/me");
}

export function changePassword(
  payload: ChangePasswordRequest
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>(
    "/users/me/password",
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
    { skipAuthRedirect: true }
  );
}