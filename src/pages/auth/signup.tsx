import SignUpFormContainer from '@/containers/SignUpFormContainer/SignUpFormContainer';
import { GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import Link from 'next/link';

const SignUpPage = () => {
	return (
		<div className='flex h-screen sm:bg-white bg-accent sm:flex-row flex-col items-center justify-center gap-5 sm:gap-0 px-5 sm:px-0'>
			<div className='logo-wrapper_mobile sm:hidden'>
				<Image
					src='/assets/logo.svg'
					alt=''
					width={100}
					height={100}
					className='aspect-square mx-auto'
				/>
				<h1 className='font-bold text-primary mt-1'>Artiexh</h1>
			</div>
			<div className='flex flex-col w-full sm:flex-1 gap-3'>
				<div className='header_desktop hidden sm:flex flex-col'>
					<h1 className='font-bold text-primary w-full max-w-xs mx-auto'>Artiexh</h1>
					<h2 className='text-subtext max-w-xs mx-auto w-full'>
						Đã có tài khoản?{' '}
						<Link href='/auth/signin' className='text-secondary'>
							Đăng nhập ngay
						</Link>
					</h2>
				</div>
				<SignUpFormContainer />
			</div>
			<div className='sm:flex flex-col flex-1 gap-3 hidden items-center justify-center bg-accent h-full'>
				<Image
					src='/assets/logo.svg'
					alt=''
					width={300}
					height={300}
					className='aspect-square mx-auto'
				/>
				<h2 className='font-bold text-primary text-center text-4xl'>
					Meo meo meo meo
					<br />
					Trả lại tâm trí tôi đây
				</h2>
			</div>
			<div className='footer-wrapper_mobile sm:hidden'>
				Đã có tài khoản?{' '}
				<Link href='/auth/signin' className='font-bold text-primary'>
					Đăng nhập
				</Link>
			</div>
		</div>
	);
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const cookies = context.req.cookies;
	if (cookies[process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY as string])
		return { redirect: { destination: '/', permanent: false } };
	return {
		props: {},
	};
}

export default SignUpPage;
