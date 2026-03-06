import axios from "axios";

export default class HttpClient {
  constructor(baseURL, headers = {}) {
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
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
      (response) => response.data,
      (error) => {
        const errorMessage = error.response?.data?.message || error.message;
        console.log(errorMessage);
        throw new Error(errorMessage);
      }
    );
  }

  async get(url, config = {}) {
    return this.client.get(url, config);
  }

  async post(url, data, config = {}) {
    return this.client.post(url, data, config);
  }

  async put(url, data, config = {}) {
    return this.client.put(url, data, config);
  }

  async delete(url, config = {}) {
    return this.client.delete(url, config);
  }
}
