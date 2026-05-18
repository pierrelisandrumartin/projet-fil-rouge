import type {
  AuthResponse,
  LibraryItem,
  LoginRequest,
  RegisterRequest,
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

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
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
    const wasAuthenticated = getToken() !== null
    clearToken();
    if (wasAuthenticated) {
      window.location.href = "/login"
    }
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API error ${response.status}: ${errorBody}`);
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

export function importWork(externalId: number, source: string): Promise<unknown> {
  return apiFetch<unknown>("/works/import", {
    method: "POST",
    body: JSON.stringify({ externalId, source }),
  });
}

export function getMyLibrary(): Promise<LibraryItem[]> {
  return apiFetch<LibraryItem[]>("/works/my");
}