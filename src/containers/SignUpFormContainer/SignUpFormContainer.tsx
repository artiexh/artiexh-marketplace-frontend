import axiosClient from '@/services/backend/axiosClient';
import { User } from '@/types/User';
import { Button, Divider, TextInput, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/router';
import { useState } from 'react';

const initialValues = {
	username: '',
	displayName: '',
	email: '',
	password: '',
	confirmPassword: '',
};

type FormValues = typeof initialValues;

const validate = {
	username: (value: string) =>
		value.trim().length >= 3 ? null : 'Username must be at least 3 characters long',
	email: (value: string) =>
		/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) ? null : 'Invalid email address',
	password: (value: string) =>
		value.trim().length >= 8 ? null : 'Password must be at least 8 characters long',
	confirmPassword: (value: string, values: FormValues) => {
		if (!value) return 'Please type your password again';
		if (value !== values.password) return 'Passwords do not match';
		return null;
	},
};

const SignUpFormContainer = () => {
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
			const { email, password, username, displayName } = values;
			const { data } = await axiosClient.post<User>('/registration/user', {
				email,
				password,
				username,
				displayName,
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
			<TextInput
				label='Display name'
				placeholder='tên mọi người thấy nè'
				disabled={isSubmitting}
				{...form.getInputProps('displayName')}
			/>
			<TextInput
				label='Email'
				placeholder='example@email.com'
				disabled={isSubmitting}
				autoComplete='email'
				{...form.getInputProps('email')}
			/>
			<PasswordInput
				label='Mật khẩu'
				placeholder='Siêu bí mật'
				disabled={isSubmitting}
				autoComplete='new-password'
				{...form.getInputProps('password')}
			/>
			<PasswordInput
				label='Mật khẩu xác nhận'
				placeholder='Giống cái ở trên'
				disabled={isSubmitting}
				autoComplete='new-password'
				{...form.getInputProps('confirmPassword')}
			/>
			<Button type='submit' className='bg-primary' disabled={isSubmitting || hasErrors}>
				Đăng kí
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
								process.env.NEXT_PUBLIC_AUTH_ENDPOINT
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

export default SignUpFormContainer;
