import ProductInfo from '@/components/ProductDetail/ProductInfo/ProductInfo';
import ShopCard from '@/components/ProductDetail/ShopCard/ShopCard';
import ssrAxiosClient from '@/services/backend/axiosMockups/ssrAxiosMockupClient';
import { Product } from '@/types/Product';
import { CommonResponseBase } from '@/types/ResponseBase';
import { Carousel } from '@mantine/carousel';
import { Breadcrumbs, Badge } from '@mantine/core';
import { GetStaticPropsContext, InferGetStaticPropsType, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

const ProductDetailPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
	product,
}) => {
	const router = useRouter();

	if (router.isFallback) return <div>Loading...</div>;
	if (!product) return <div>Product not found</div>;

	const { description, id, attaches, name, price, ratings, publishDatetime, artistInfo, tags } =
		product;

	const breadCrumps = [
		{ label: 'Home', href: '/' },
		{ label: 'Products', href: '/products' },
		{ label: name, href: `/products/${id}` },
	].map(({ href, label }) => (
		<Link className='text-subtext last:text-black' key={href} href={href}>
			{label}
		</Link>
	));
	return (
		<>
			<nav>Navbar</nav>
			<div className='page-wrapper max-w-7xl px-5 sm:px-10 mx-auto mt-10'>
				<Breadcrumbs>{breadCrumps}</Breadcrumbs>
				<div className='mt-10'>
					<main className='flex gap-10'>
						<Carousel
							className='flex-1 overflow-hidden rounded-lg rounded-tl-none'
							loop
							withIndicators
						>
							{attaches.map((image) => (
								<Carousel.Slide key={image.id}>
									<div className='flex h-[400px] bg-white'>
										<Image src={image.url} className='object-contain' alt={image.title} fill />
									</div>
								</Carousel.Slide>
							))}
						</Carousel>
						<ProductInfo product={product} />
					</main>
					<section className='detail-wrapper flex gap-10 mt-10'>
						<div className='flex-1'>
							<h3 className='text-2xl font-bold'>Description</h3>
							<p className='mt-1'>
								{description} Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nostrum
								voluptatibus delectus id, officiis soluta iusto ut a excepturi harum quidem adipisci
								quasi, modi consectetur similique voluptates. Ad quasi accusantium blanditiis.
							</p>
							<h3 className='text-2xl font-bold mt-10'>Tags</h3>
							<div className='flex gap-3 flex-wrap mt-3'>
								{[...tags, ...tags, ...tags].map((tag) => (
									<Badge key={tag} size='xl'>
										{tag}
									</Badge>
								))}
							</div>
						</div>
						<ShopCard artist={artistInfo} />
					</section>
				</div>
			</div>
		</>
	);
};

export const getStaticPaths = async () => {
	try {
		const {
			data: { data },
		} = await ssrAxiosClient.get<CommonResponseBase<Product[]>>('/products');
		console.log(data);
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
	const { data } = await ssrAxiosClient.get<CommonResponseBase<Product>>(`/products/${params.id}`);
	return {
		props: {
			product: data.data,
		},
	};
};

export default ProductDetailPage;
