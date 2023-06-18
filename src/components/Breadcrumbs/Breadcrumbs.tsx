import { Breadcrumbs } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Breadcrumps = () => {
	const router = useRouter();

	const paths = router.asPath.split('/');

	const breadCrumps = paths.map((path, index) => {
		const href = paths.slice(0, index + 1).join('/') || '/';

		if (index === paths.length - 1) {
			return <span key={href}>{path}</span>;
		}

		return (
			<Link key={href} href={href} className='text-subtext hover:text-black hover:underline'>
				{path ? path[0].toUpperCase() + path.slice(1) : 'Home'}
			</Link>
		);
	});

	return <Breadcrumbs>{breadCrumps}</Breadcrumbs>;
};

export default Breadcrumps;
