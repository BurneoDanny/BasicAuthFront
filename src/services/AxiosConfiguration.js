import axios from "axios";

// function getCsrfToken() {
//   const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
//   const csrfCookie = cookies.find((cookie) => cookie.startsWith("XSRF-TOKEN="));
//   if (csrfCookie) {
//     return decodeURIComponent(csrfCookie.split("=")[1]); // Obtener el valor después del "="
//   }
//   console.error("CSRF token not found"); // aparecera en la primera llamada ya que no hay csrf token
//   return null;
// }

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

// Interceptor para añadir el token CSRF a cada solicitud (en el header) si está presente
// apiClient.interceptors.request.use(
//   async (config) => {
//     const csrfToken = getCsrfToken();
//     if (csrfToken) {
//       config.headers["X-XSRF-TOKEN"] = csrfToken;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// We can use interceptors to refresh the token if it expires and retry the request,
// so the user doesn't have to log in again. This is done by intercepting a 401 response.
// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response.status === 401 && !originalRequest._retry) {
//       // Check if the response has message (indicating token expiration)
//       if (
//         error.response.data &&
//         typeof error.response.data === "string" &&
//         error.response.data.includes("Token expired or invalid")
//       ) {
//         originalRequest._retry = true;
//         try {
//           await apiClient.post("/user/refresh-token");
//           return apiClient(originalRequest);
//         } catch (refreshError) {
//           console.error("Token refresh failed:", refreshError);
//           return Promise.reject(refreshError);
//         }
//       } else {
//         console.error("401 Unauthorized with message:", error.response.data);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default apiClient;
