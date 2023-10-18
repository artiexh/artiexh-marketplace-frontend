import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;

const refresh = () => {
  if (isRefreshing) return Promise.reject();
  isRefreshing = true;
  return axiosClient.post("/auth/refresh").then(() => {
    isRefreshing = false;
  });
};

axiosClient.interceptors.response.use(undefined, (error) => {
  const originalRequest = error.config;
  const status = error?.response?.status;

  // For invalid password or expired/invalid refresh_token
  if (
    status === 401 &&
    ["/auth/login", "/auth/refresh"].includes(originalRequest.url)
  ) {
    return Promise.reject(error);
  }

  // For expired tokens
  if (status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    return refresh().then(() => {
      return axiosClient(originalRequest);
    });
  }

  return Promise.reject(error);
});

export const fetcher = <T = any>(url: string) =>
  axiosClient.get<T>(url).then((res) => res.data);

export default axiosClient;
