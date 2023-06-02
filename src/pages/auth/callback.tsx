import axiosClient from '@/services/backend/axiosClient';
import { User } from '@/types';
import { TextInput, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

const CallbackPage = ({
	providerId,
	sub,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm({
		initialValues: {
			username: '',
		},
		validate: {
			username: (value: string) =>
				value.trim().length >= 3 ? null : 'Username must be at least 3 characters long',
		},
		validateInputOnBlur: true,
		validateInputOnChange: true,
	});

	const onSubmit = async (values: { username: string }) => {
		let provider = {} as { [key: string]: string };
		setIsSubmitting(true);
		provider[`${providerId as string}Id`] = sub as string;

		try {
			const { data } = await axiosClient.post<User>('/registration/user', {
				username: values.username,
				...provider,
			});
			console.log(data);
			router.push('/');
		} catch (error) {
			console.log(error);
			form.setFieldError('username', 'Username already exists');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form className='max-w-xs mx-auto flex flex-col gap-3' onSubmit={form.onSubmit(onSubmit)}>
			<h2>Before continuing, pick a username</h2>
			<TextInput label='Username' {...form.getInputProps('username')} />
			<Button
				type='submit'
				className='bg-primary w-full'
				disabled={isSubmitting}
				loading={isSubmitting}
			>
				Continue
			</Button>
		</form>
	);
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const { providerId, sub } = context.query;
	if (!providerId || !sub) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
			props: {},
		};
	}
	return {
		props: {
			providerId,
			sub,
		},
	};
}

export default CallbackPage;
