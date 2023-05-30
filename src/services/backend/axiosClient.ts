import axios from 'axios';

const axiosClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
	withCredentials: true,
});

let isRefreshing = false;

const refresh = () => {
	if (isRefreshing) return Promise.reject();
	isRefreshing = true;
	return axiosClient.post('/auth/refresh').then(() => {
		isRefreshing = false;
	});
};

axiosClient.interceptors.response.use(undefined, (error) => {
	const originalRequest = error.config;
	const status = error?.response?.status;

	if (status === 401 && !originalRequest._retry) {
		originalRequest._retry = true;
		return refresh().then(() => {
			return axiosClient(originalRequest);
		});
	}

	return Promise.reject(error);
});
