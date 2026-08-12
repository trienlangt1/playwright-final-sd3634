import { APIRequestContext } from '@playwright/test';

export class ApiClient {
  constructor(private request: APIRequestContext) {}

  private headers(token?: string) {
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  }

  async post<T>(path: string, data?: object, token?: string): Promise<T> {
    const response = await this.request.post(`/api${path}`, { data, headers: this.headers(token) });
    if (!response.ok()) {
      throw new Error(`POST ${path} failed: ${response.status()} ${await response.text()}`);
    }
    return response.json();
  }

  async get<T>(path: string, token?: string): Promise<T> {
    const response = await this.request.get(`/api${path}`, { headers: this.headers(token) });
    if (!response.ok()) {
      throw new Error(`GET ${path} failed: ${response.status()} ${await response.text()}`);
    }
    return response.json();
  }

  // PATCH /profile requires multipart/form-data per Swagger's "Try it out" curl example
  async patchMultipart<T>(path: string, multipart: Record<string, string>, token?: string): Promise<T> {
    const response = await this.request.patch(`/api${path}`, { multipart, headers: this.headers(token) });
    if (!response.ok()) {
      throw new Error(`PATCH ${path} failed: ${response.status()} ${await response.text()}`);
    }
    return response.json();
  }
}