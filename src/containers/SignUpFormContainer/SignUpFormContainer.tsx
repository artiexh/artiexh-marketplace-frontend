import { Button, Divider, TextInput, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';

const initialValues = {
	username: '',
	email: '',
	password: '',
	confirmPassword: '',
};

type FormValues = typeof initialValues;

const SignUpFormContainer = () => {
	const form = useForm({
		initialValues,
		validate: {
			username: (value) =>
				value.trim().length >= 3 ? null : 'Username must be at least 3 characters long',
			email: (value) =>
				/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) ? null : 'Invalid email address',
			password: (value) =>
				value.trim().length >= 6 ? null : 'Password must be at least 6 characters long',
			confirmPassword: (value, values) =>
				value === values.password ? null : 'Passwords do not match',
		},
		validateInputOnChange: true,
		validateInputOnBlur: true,
	});

	const onSubmit = async (values: FormValues) => {
		console.log(values);
	};

	return (
		<form className='max-w-xs mx-auto flex flex-col gap-3' onSubmit={form.onSubmit(onSubmit)}>
			<TextInput
				label='Username'
				placeholder='example.username'
				{...form.getInputProps('username')}
			/>
			<TextInput label='Email' placeholder='example@email.com' {...form.getInputProps('email')} />
			<PasswordInput
				label='Password'
				placeholder='Super secret'
				{...form.getInputProps('password')}
			/>
			<PasswordInput
				label='Confirm password'
				placeholder='Same as Super secret'
				{...form.getInputProps('confirmPassword')}
			/>
			<Button type='submit' className='bg-primary'>
				Sign up
			</Button>
			<Divider label='Or sign in with' labelPosition='center' />
			<div className='flex gap-3'>
				<Button className='bg-primary flex-1'>Google</Button>
				<Button className='bg-primary flex-1'>Facebook</Button>
				<Button className='bg-primary flex-1'>Twitter</Button>
			</div>
		</form>
	);
};

export default SignUpFormContainer;
