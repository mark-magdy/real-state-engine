const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiError {
  message: string;
  status: number;
}

export const apiClient = {
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw { message: `API error: ${res.statusText}`, status: res.status } as ApiError;
      }
      return res.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw { message: 'Request timed out', status: 408 } as ApiError;
      }
      throw error;
    }
  },

  async post<T>(endpoint: string, body: unknown, options?: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(body),
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw { message: `API error: ${res.statusText}`, status: res.status } as ApiError;
      }
      return res.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw { message: 'Request timed out', status: 408 } as ApiError;
      }
      throw error;
    }
  },
};
