export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
}

export interface WorkSearchResult {
    externalId: number;
    source: string;
    title: string;
    titleEnglish: string | null;
    synopsis: string | null;
    chapters: number | null;
    volumes: number | null;
    status: string;
    type: string;
    coverUrl: string | null;
}