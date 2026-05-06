import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "";

const api = axios.create({
  baseURL,
  timeout: 12000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const message =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Something went wrong.";
    return Promise.reject({ status, message, raw: err });
  }
);

export const authApi = {
  register: (username, password) => api.post("/api/users/register", { username, password }),
  login: (username, password) => api.post("/api/users/login", { username, password }),
};

export const userApi = {
  getMaxScore: (username) => api.post("/api/users/getMaxScore", { username }),
  updateScore: (username, newScore) =>
    api.post("/api/users/updateScore", { username, newScore }),
  leaderboard: () => api.get("/api/users/leaderboard"),
};

export default api;
