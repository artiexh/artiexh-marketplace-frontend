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
	if (cookies['refresh_token']) return { redirect: { destination: '/', permanent: false } };
	return {
		props: {},
	};
}

export default SignInPage;
