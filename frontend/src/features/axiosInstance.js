import axios from "axios";

// Create instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Request Interceptor (attach token)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ⚠️ Response Interceptor (handle errors globally)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: Unauthorized (token expired)
    if (error.response && error.response.status === 401 && !error.config.url.includes('/auth/')) {
      console.log("Unauthorized! Logging out...");

      // Check if this was a login or registration request
      const isAuthRequest = error.config && (
        error.config.url.includes("/auth/login") || 
        error.config.url.includes("/auth/register") || 
        error.config.url.includes("/auth/google")
      );

      if (!isAuthRequest) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Redirect to appropriate login page based on current path
        const currentPath = window.location.pathname;
        let redirectPath = "/login";
        
        if (currentPath.startsWith("/admin")) {
          redirectPath = "/admin/login";
        } else if (currentPath.startsWith("/instructor")) {
          redirectPath = "/instructor/login";
        }

        window.location.href = redirectPath;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance; 
