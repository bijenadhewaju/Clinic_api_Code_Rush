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
(response)=> response, async(error)=>{
    if(error.response?.data?.code === "token_not_valid"){
        localStorage.removeItem("token");
        window.location.href = "/login";
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

// for patient profile
export const getMyProfile    = ()     => API.get("clinic/patient/profile/");
export const updateMyProfile = (data) => API.patch("clinic/patient/profile/", data);

