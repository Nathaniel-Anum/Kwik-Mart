// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://kwirkmart.expertech.dev/api",
//   headers: { "Content-Type": "application/json" },
// });

// api.interceptors.request.use((config) => {
//   // Debug: Check what's actually in localStorage
//   // console.log("All localStorage keys:", Object.keys(localStorage));
//   // console.log("localStorage 'access':", localStorage.getItem("access"));

//   const token = localStorage.getItem("access");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//     // console.log("Token added to headers");
//   } else {
//     // console.log("No token found!");
//   }

//   // console.log("Final headers:", config.headers);
//   return config;
// });

// export default api;


import axios from "axios";

const api = axios.create({
  baseURL: "https://kwirkmart.expertech.dev/api",
  headers: { "Content-Type": "application/json" },
});

// ===== Request Interceptor =====
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===== Response Interceptor =====
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Check for 401 Unauthorized (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Clear all stored auth info
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");

      // ✅ Redirect to login page
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;

