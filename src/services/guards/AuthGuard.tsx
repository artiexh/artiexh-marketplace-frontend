// import { useRouter } from 'next/router';
import { useEffect } from 'react';
import axiosClient from '../backend/axiosClient';
import { AxiosError } from 'axios';

const AuthGuard = () => {
	// const router = useRouter();

	useEffect(() => {
		const validate = async () => {
			try {
				const { data } = await axiosClient.post('/auth/refresh');
			} catch (error) {
				const axiosError = error as AxiosError;
				console.log(axiosError);
			}
		};
		validate();
	}, []);

	return null;
};

export default AuthGuard;
