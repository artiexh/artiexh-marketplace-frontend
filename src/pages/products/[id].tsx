import axiosClient from '@/services/backend/axiosClient';
import { Carousel } from '@mantine/carousel';
import { Breadcrumbs } from '@mantine/core';
import { GetStaticPropsContext, InferGetStaticPropsType, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';

const ProductDetailPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
	product,
}) => {
	const router = useRouter();
	if (router.isFallback) return <div>Loading...</div>;
	if (!product) return <div>Product not found</div>;

	const breadCrumps = [
		{ label: 'Home', href: '/' },
		{ label: 'Products', href: '/products' },
		{ label: product.name, href: `/products/${product.id}` },
	].map(({ href, label }) => (
		<Link className='text-subtext last:text-black' key={href} href={href}>
			{label}
		</Link>
	));
	return (
		<>
			<div>Navbar</div>
			<div className='max-w-7xl px-5 mx-auto'>
				<Breadcrumbs>{breadCrumps}</Breadcrumbs>
				<div>
					<div className='flex gap-5'>
						<Carousel height={200} loop>
							<Carousel.Slide>1</Carousel.Slide>
							<Carousel.Slide>1</Carousel.Slide>
							<Carousel.Slide>1</Carousel.Slide>
							<Carousel.Slide>1</Carousel.Slide>
							<Carousel.Slide>1</Carousel.Slide>
						</Carousel>
					</div>
				</div>
			</div>
		</>
	);
};

export const getStaticPaths = async () => {
	try {
		const { data } = await axiosClient.get<Product[]>('/products');
		const paths = data.map((product) => ({
			params: { id: `${product.id}` },
		}));
		return {
			paths,
			fallback: true,
		};
	} catch (error) {
		console.log(error);
		return {
			paths: [],
			fallback: true,
		};
	}
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
	const { params } = context;
	if (!params?.id) return { props: {} };
	const { data } = await axiosClient.get<Product>(`/products/${params.id}`);
	return {
		props: {
			product: data,
		},
	};
};

export default ProductDetailPage;
