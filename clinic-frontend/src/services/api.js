import axios from "axios";

const API = axios.create({
  baseURL: "/api/",
});

// Attach JWT token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req; // VERY IMPORTANT
});
//refresh the token
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token is invalid and we haven't already retried
    if (error.response?.status === 401 && error.response?.data?.code === "token_not_valid" && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          // Try to get a new access token
          const res = await axios.post("/api/token/refresh/", { refresh: refreshToken });
          const newAccessToken = res.data.access;
          
          // Save new token and retry the original request
          localStorage.setItem("token", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return API(originalRequest);
        } catch (refreshError) {
          // If refresh token is also invalid/expired, log out
          localStorage.removeItem("token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("role");
          window.location.href = "/login";
        }
      } else {
        // No refresh token available, log out
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("role");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;

// API endpoints
export const getPatients = () => API.get("clinic/patient/");
export const addPatient = (data) => API.post("clinic/patient/", data);
export const getDoctors = () => API.get("clinic/doctors/");
// add for registration
export const registerPatient = (data) =>
  API.post("register/", data);

export const registerDoctor = (data) =>
  API.post("clinic/doctors/", data);

