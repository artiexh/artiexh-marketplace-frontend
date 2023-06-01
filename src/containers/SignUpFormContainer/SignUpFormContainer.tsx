import axiosClient from '@/services/backend/axiosClient';
import { User } from '@/types';
import { Button, Divider, TextInput, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/router';
import { useState } from 'react';

const initialValues = {
	username: '',
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
		value.trim().length >= 6 ? null : 'Password must be at least 6 characters long',
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
			const { email, password, username } = values;
			const { data } = await axiosClient.post<User>('/registration/user', {
				email,
				password,
				username,
			});
			console.log(data);
			// TODO:
			// Save this
			router.push('/');
		} catch (error) {
			console.log(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const hasErrors = Object.keys(form.errors).length > 0;

	return (
		<form className='max-w-xs mx-auto flex flex-col gap-3' onSubmit={form.onSubmit(onSubmit)}>
			<TextInput
				label='Username'
				placeholder='example.username'
				disabled={isSubmitting}
				{...form.getInputProps('username')}
			/>
			<TextInput label='Email' placeholder='example@email.com' {...form.getInputProps('email')} />
			<PasswordInput
				label='Password'
				placeholder='Super secret'
				disabled={isSubmitting}
				autoComplete='new-password'
				{...form.getInputProps('password')}
			/>
			<PasswordInput
				label='Confirm password'
				placeholder='Same as Super secret'
				disabled={isSubmitting}
				autoComplete='new-password'
				{...form.getInputProps('confirmPassword')}
			/>
			<Button type='submit' className='bg-primary' disabled={isSubmitting || hasErrors}>
				Sign up
			</Button>
			<Divider label='Or sign in with' labelPosition='center' />
			<div className='flex gap-3'>
				<a
					href={`${
						process.env.NEXT_PUBLIC_API_ENDPOINT
					}/oauth2/google?redirect_uri=${encodeURIComponent(
						typeof window !== 'undefined' ? 'http://localhost:3000' : 'http://localhost:3000'
					)}`}
				>
					<Button
						className='bg-primary flex-1'
						disabled={isSubmitting}
						onClick={() => {
							console.log(location.href);
							// router.push(
							// 	`localhost:8080/api/v1/oauth2/google?redirect_uri=${encodeURIComponent(
							// 		location.href
							// 	)}`
							// );
						}}
					>
						Google
					</Button>
				</a>
				<Button className='bg-primary flex-1' disabled={isSubmitting}>
					Facebook
				</Button>
				<Button className='bg-primary flex-1' disabled={isSubmitting}>
					Twitter
				</Button>
			</div>
			<Button
				className='bg-primary'
				onClick={() => {
					(async function () {
						try {
							await axiosClient.post('/auth/login', {
								username: 'username',
								password: '123456',
							});
						} catch (error) {
							console.log(error);
						}
					})();
				}}
			>
				Sign in
			</Button>
		</form>
	);
};

export default SignUpFormContainer;
