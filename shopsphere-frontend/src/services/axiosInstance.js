import axios from "axios";

const axiosInstance = axios.create({
 baseURL: "https://shopsphere-xwok.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach the JWT token to every backend request
axiosInstance.interceptors.request.use(
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

export default axiosInstance;