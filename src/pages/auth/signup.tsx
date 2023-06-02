import SignUpFormContainer from '@/containers/SignUpFormContainer/SignUpFormContainer';
import { GetServerSidePropsContext } from 'next';

const SignInPage = () => {
	return (
		<div>
			<SignUpFormContainer />
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

export default SignInPage;
