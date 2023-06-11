import ssrAxiosClient from '@/services/backend/axiosMockups/ssrAxiosMockupClient';
import { Category, Product, Tag } from '@/types/Product';
import { GetStaticPropsContext, InferGetStaticPropsType, NextPage } from 'next';
import clsx from 'clsx';
import { CommonResponseBase } from '@/types/ResponseBase';
import useSWR from 'swr';
import axiosClient from '@/services/backend/axiosMockups/axiosMockupClient';
import productStyles from '@/styles/Products/productList.module.scss';
import ProductPreviewCard from '@/components/Cards/ProductCard/ProductPreviewCard';
import Layout from '@/layouts/Layout/Layout';
import { Badge, Button, Checkbox, Divider, NumberInput, Rating, Select } from '@mantine/core';
import { FC, useState } from 'react';

type SidebarProps = {
	categories: Category[];
};

const Sidebar: FC<SidebarProps> = ({ categories }) => {
	const [activeCategory, setActiveCategory] = useState(0);
	const [moreCategories, setMoreCategories] = useState(false);
	const [moreLocations, setMoreLocations] = useState(false);
	return (
		<nav className='hidden lg:block px-4'>
			<div className='flex justify-between items-center'>
				<h2 className='font-bold text-xl'>Bộ lọc</h2>
				<Button variant='outline' size='xs'>
					Clear
				</Button>
			</div>
			<Divider className='my-3' />
			<h3 className='font-bold text-lg'>Price range</h3>
			<div className='flex mt-2 items-center justify-between'>
				<NumberInput hideControls />
				<span className='mx-2'>-</span>
				<NumberInput hideControls />
			</div>
			<Divider className='my-3' />
			<h3 className='font-bold text-lg'>Ratings</h3>
			<div className='flex items-center gap-3'>
				<Rating />
				<span className='text-subtext text-sm'>and above</span>
			</div>
			<Divider className='my-3' />
			<h3 className='font-bold text-lg'>Categories</h3>
			<div className='flex flex-col gap-2'>
				{categories.slice(0, 5).map((category, index) => (
					<div
						className={clsx(index === activeCategory ? 'text-primary' : 'text-subtext')}
						key={category.id}
						onClick={() => setActiveCategory(index)}
					>
						{category.name}
					</div>
				))}
				{moreCategories &&
					categories.slice(5).map((category, index) => (
						<div
							className={clsx(index + 5 === activeCategory ? 'text-primary' : 'text-subtext')}
							key={category.id}
							onClick={() => setActiveCategory(index + 5)}
						>
							{category.name}
						</div>
					))}
				{categories.length > 5 && (
					<div
						className='text-subtext cursor-pointer'
						onClick={() => setMoreCategories(!moreCategories)}
					>
						{moreCategories ? 'Show less UP' : 'Show more DOWN'}
					</div>
				)}
			</div>
			<Divider className='my-3' />
			<h3 className='font-bold text-lg'>Locations</h3>
			<Checkbox.Group className='flex flex-col gap-2'>
				{categories.slice(0, 5).map((category) => (
					<Checkbox key={category.id} label={category.name} value={category.id} />
				))}
				{moreLocations &&
					categories
						.slice(5)
						.map((category) => (
							<Checkbox key={category.id} label={category.name} value={category.id} />
						))}
				{categories.length > 5 && (
					<div
						className='text-subtext cursor-pointer'
						onClick={() => setMoreLocations(!moreCategories)}
					>
						{moreLocations ? 'Show less UP' : 'Show more DOWN'}
					</div>
				)}
			</Checkbox.Group>
			<Divider className='my-3' />
			<Button className='bg-primary w-full'>Apply</Button>
		</nav>
	);
};

const ProductListPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
	categories,
}) => {
	const { data: products, isLoading } = useSWR(['/products?_limit=10&_page=1'], (key) =>
		axiosClient.get<CommonResponseBase<Product[]>>(key[0]).then((res) => res.data.data)
	);

	return (
		<Layout>
			<div className='bg-white h-14 flex items-center gap-x-4 px-6 lg:hidden w-screen -ml-6'>
				<Button className='flex-1' variant='outline'>
					Bộ lọc
				</Button>
				<Button className='flex-1' variant='outline'>
					Sắp xếp
				</Button>
			</div>
			<h1 className='lg:text-4xl mt-10 lg:mt-0 font-bold'>All products</h1>
			<div className='grid grid-cols-1 lg:grid-cols-5 gap-x-4 mt-4'>
				<Sidebar categories={categories} />
				<div className='col-span-4'>
					<div className='justify-between items-center hidden lg:flex'>
						<div className='flex gap-3'>
							{[...Array(5)].map((_, index) => (
								<Badge key={index}>Tag {index}</Badge>
							))}
						</div>
						<Select
							data={[
								{ value: 'price_asc', label: 'Price low to high' },
								{ value: 'price_desc', label: 'Price high to low' },
								{ value: 'rating', label: 'Rating' },
							]}
							// doesnt work
							defaultValue='price_asc'
							clearable
						/>
					</div>
					<div className={clsx(productStyles['product-list-grid'], 'col-span-4 lg:mt-10')}>
						{products?.map((product, index) => (
							<ProductPreviewCard data={product} key={index} />
						))}
						{/* Chen infinite scroll cua @kekkei9 */}
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default ProductListPage;

export async function getStaticProps() {
	const { data: categories } = await ssrAxiosClient.get<CommonResponseBase<Category[]>>(
		'/categories'
	);
	return {
		props: { categories: categories.data },
	};
}
