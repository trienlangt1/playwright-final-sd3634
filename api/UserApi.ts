import { ApiClient } from './ApiClient';

export interface User {
  id: string;
  username: string;
  name: string;
  role: string;
  avatar: string | null;
}

interface LoginResponse {
  token: string;
  user: User;
}

export class UserApi {
  constructor(private apiClient: ApiClient) {}

  async login(username: string, password: string): Promise<LoginResponse> {
    return this.apiClient.post<LoginResponse>('/auth/login', { username, password });
  }

  async getProfile(token: string): Promise<User> {
    return this.apiClient.get<User>('/profile', token);
  }

  // avatar is sent empty to match the observed working multipart request; adjust if avatar removal is not intended
  async updateProfileName(token: string, name: string): Promise<User> {
    return this.apiClient.patchMultipart<User>('/profile', { name, avatar: '' }, token);
  }
}