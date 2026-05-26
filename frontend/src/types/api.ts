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

export interface LibraryItem {
  progressId: number;
  workId: number;
  externalId: number | null;
  source: string | null;
  title: string;
  synopsis: string;
  coverUrl: string;
  status: string;
  type: string;
  totalVolumes: number;
  totalChapters: number;
  currentVolume: number;
  currentChapter: number;   
}

export interface UserResponse {
    id: number;
    username: string;
    email: string;
    createdAt: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}
