import axios from 'axios';

class Http {
  constructor() {
    this.instance = axios.create({
      baseURL: 'https://localhost:7276/api/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.instance.interceptors.request.use(
      this.handleBefore.bind(this),
      this.handleError
    );
  }

  handleBefore(config) {
    const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }

  handleError(error) {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
}

const http = new Http().instance;
export default http;
