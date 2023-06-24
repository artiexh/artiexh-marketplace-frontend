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
import { Badge, Button, Select } from '@mantine/core';
import { Sidebar } from '@/components/ProductList';
import { useEffect, useState } from 'react';
import { urlFormatter } from '@/utils/formatter';
import { useRouter } from 'next/router';

const ProductListPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
	categories,
}) => {
	const router = useRouter();
	const params = router.query;

	const [pagination, setPagination] = useState({
		_limit: 10,
		_page: 1,
		_sort: 'cost',
		_order: 'asc',
	});

	const [url, setUrl] = useState(
		urlFormatter('/products', {
			...pagination,
			...params,
		})
	);

	const { data: products, isLoading } = useSWR([url], (key) =>
		axiosClient.get<CommonResponseBase<Product[]>>(key[0]).then((res) => res.data.data)
	);

	router.events?.on('routeChangeComplete', () => {
		const url = urlFormatter('/products', {
			...pagination,
			...params,
		});

		setUrl(url);
	});

	const onSort = (value: string | null) => {
		if (!value) return;
		const [key, direction] = value.split('_');
		// Update pagination
		setPagination((prev) => ({ ...prev, _sort: key, _order: direction }));
		//  Format the URL
		const url = urlFormatter('/products', {
			...pagination,
			...params,
			_sort: key,
			_order: direction,
		});
		router.replace(url, undefined, { shallow: true });
	};

	useEffect(() => {
		// Pagination is already in here, dont fuck with it
		setUrl(
			urlFormatter('/products', {
				...params,
			})
		);
		// For pagination
		setPagination((prev) => ({
			...prev,
			_order: (params._order as string) || prev._order,
			_sort: (params._sort as string) || prev._sort,
		}));
	}, [params]);

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
			<h1 className='lg:text-3xl mt-10 lg:mt-0 font-bold px-5 lg:px-10'>Tất cả sản phẩm</h1>
			<div className='grid grid-cols-1 lg:grid-cols-12 gap-x-12 mt-4 px-5 lg:px-10'>
				<Sidebar categories={categories} pagination={pagination} />
				<div className='col-span-9'>
					<div className='justify-between items-center hidden lg:flex'>
						<div className='flex gap-3'>
							<Badge>Cho nhan</Badge>
							<Badge>Cho nhan</Badge>
							<Badge>Cho nhan</Badge>
							<Badge>Cho nhan</Badge>
						</div>
						<Select
							data={[
								{ value: 'cost_asc', label: 'Price low to high' },
								{ value: 'cost_desc', label: 'Price high to low' },
								{ value: 'ratings_asc', label: 'Ratings low to high' },
								{ value: 'ratings_desc', label: 'Ratings high to low' },
							]}
							onChange={onSort}
							value={`${pagination._sort}_${pagination._order}`}
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
