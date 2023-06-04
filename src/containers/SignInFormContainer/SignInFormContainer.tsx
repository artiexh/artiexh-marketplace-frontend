import axiosClient from '@/services/backend/axiosClient';
import { User } from '@/types/User';
import { Button, Divider, TextInput, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/router';
import { useState } from 'react';

const initialValues = {
	username: '',
	password: '',
};

type FormValues = typeof initialValues;

const validate = {
	username: (value: string) => (value.trim().length > 0 ? null : 'Username cannot be empty'),
	password: (value: string) => (value.trim().length > 0 ? null : 'Password cannot be empty'),
};

const SignInFormContainer = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const form = useForm({
		initialValues,
		validate,
		validateInputOnChange: true,
		validateInputOnBlur: true,
	});

	const onSubmit = async (values: FormValues) => {
		setIsSubmitting(true);
		try {
			const { password, username } = values;
			const { data } = await axiosClient.post<User>('/auth/login', {
				password,
				username,
			});
			console.log(data);
			// TODO:
			// Save this
			router.push('/');
		} catch (error) {
			// TODO:
			// Handle 401 invalid credentials
			console.log(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const hasErrors = Object.keys(form.errors).length > 0;

	return (
		<form
			className='max-w-xs mx-auto flex flex-col gap-3 sm:gap-5 sm:bg-white bg-accent w-full sm:flex-1'
			onSubmit={form.onSubmit(onSubmit)}
		>
			<TextInput
				label='Username'
				placeholder='username nè'
				disabled={isSubmitting}
				autoComplete='username'
				{...form.getInputProps('username')}
			/>
			<PasswordInput
				label='Mật khẩu'
				placeholder='Siêu bí mật'
				disabled={isSubmitting}
				autoComplete='password'
				{...form.getInputProps('password')}
			/>

			<Button type='submit' className='bg-primary' disabled={isSubmitting || hasErrors}>
				Đăng nhập
			</Button>
			<Divider label='Hoặc đăng nhập bằng' labelPosition='center' />
			<div className='flex flex-row sm:flex-col gap-3'>
				<Button
					className='flex-1 p-2'
					color='blue'
					variant='outline'
					disabled={isSubmitting}
					onClick={() => {
						router.push(
							`${
								process.env.NEXT_PUBLIC_API_ENDPOINT
							}/oauth2/authorization/google?redirect_uri=${encodeURIComponent(
								`${location.origin}/auth/callback`
							)}`
						);
					}}
				>
					Google
				</Button>
				<Button className='flex-1 p-2' color='red' variant='outline' disabled={isSubmitting}>
					Facebook
				</Button>
			</div>
		</form>
	);
};

export default SignInFormContainer;
