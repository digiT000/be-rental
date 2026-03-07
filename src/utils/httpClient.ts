import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export default class HttpClient {
  private client: AxiosInstance;

  constructor(baseURL: string, headers: Record<string, string> = {}) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      timeout: 10000,
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // You can add auth tokens here
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      (error) => {
        const errorMessage = error.response?.data?.message || error.message;
        console.log(errorMessage);
        throw new Error(errorMessage);
      }
    );
  }

  async get<T = any>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
    return this.client.get(url, config);
  }

  async post<T = any>(url: string, data?: any, config: AxiosRequestConfig = {}): Promise<T> {
    return this.client.post(url, data, config);
  }

  async put<T = any>(url: string, data?: any, config: AxiosRequestConfig = {}): Promise<T> {
    return this.client.put(url, data, config);
  }

  async delete<T = any>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
    return this.client.delete(url, config);
  }
}
