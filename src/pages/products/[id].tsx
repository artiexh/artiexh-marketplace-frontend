import axiosClient from '@/services/backend/axiosClient';
import { Carousel } from '@mantine/carousel';
import { GetStaticPropsContext, InferGetStaticPropsType, NextPage } from 'next';
import { useRouter } from 'next/router';

const ProductDetailPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
	product,
}) => {
	const router = useRouter();
	if (router.isFallback) return <div>Loading...</div>;
	if (!product) return <div>Product not found</div>;
	return (
		<div>
			<div className='flex gap-5'>
				<Carousel>
					<Carousel.Slide></Carousel.Slide>
				</Carousel>
			</div>
		</div>
	);
};

export const getStaticPaths = async () => {
	try {
		const { data } = await axiosClient.get<Product[]>('/products');
		const paths = data.map((product) => ({
			params: { id: `${product.id}` },
		}));
		console.log(paths);
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
