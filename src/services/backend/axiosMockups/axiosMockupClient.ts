import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MOCK_API_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
});

//set client base URL again
axiosClient.interceptors.request.use(
  function (config: InternalAxiosRequestConfig<any>) {
    // Do something before request is sent

    return config;
  },
  function (error: any) {
    // Do something with request error
    return Promise.reject(error);
  }
);
// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response: AxiosResponse) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    return Promise.reject(error);
  }
);

export const setAuthToken = (token?: string) => {
  if (token) {
    axiosClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axiosClient.defaults.headers.common.Authorization;
  }
};

export const fetcher = (url: string) =>
  axiosClient.get(url).then((res) => res.data);

export default axiosClient;
