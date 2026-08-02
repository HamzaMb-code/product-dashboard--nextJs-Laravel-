import axios from "axios";

const api = axios.create({
  baseURL: "https://product-dashboard-api-68cw.onrender.com/api",
  headers: {
    // "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add the token before every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.assign("/login");
    }

    return Promise.reject(error);
  }
);

export default api;
