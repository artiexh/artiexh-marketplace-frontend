import { Category, Product, Tag } from '@/types/Product';
import clsx from 'clsx';
import { CommonResponseBase } from '@/types/ResponseBase';
import useSWR from 'swr';
import axiosClient from '@/services/backend/axiosMockups/axiosMockupClient';
import productStyles from '@/styles/Products/productList.module.scss';
import ProductPreviewCard from '@/components/Cards/ProductCard/ProductPreviewCard';
import { Badge, Button, Input, Select } from '@mantine/core';
import { MobileFilter, Sidebar } from '@/components/ProductList';
import { FC, useEffect, useState } from 'react';
import { urlFormatter } from '@/utils/formatter';
import { useRouter } from 'next/router';
import MobileSort from '@/components/ProductList/MobileSort';
import { useForm } from '@mantine/form';
import { FilterProps } from '@/services/backend/types/Filter';
import { DEFAULT_FILTERS, SORT_OPTIONS } from '@/constants/ProductList';
import {
	IconBrandWechat,
	IconFilter,
	IconSearch,
	IconShoppingCart,
	IconSortAscendingLetters,
} from '@tabler/icons-react';
import Layout from '@/layouts/Layout/Layout';

type ProductListContainerProps = {
	categories: Category[];
};

const ProductListContainer: FC<ProductListContainerProps> = ({ categories }) => {
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

	const [showPopup, setShowPopup] = useState('');

	const { data: products, isLoading } = useSWR([url], (key) =>
		axiosClient.get<CommonResponseBase<Product[]>>(key[0]).then((res) => res.data.data)
	);

	const form = useForm<Partial<FilterProps>>({
		initialValues: DEFAULT_FILTERS,
	});

	const { setValues } = form;

	router.events?.on('routeChangeComplete', () => {
		const url = urlFormatter('/products', {
			...pagination,
			...params,
		});

		setUrl(url);
	});

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

	useEffect(() => {
		// Updates on reload
		setValues({
			categoryId: (params.categoryId as string) || DEFAULT_FILTERS.categoryId,
			cost_gte: Number(params.cost_gte) || DEFAULT_FILTERS.cost_gte,
			cost_lte: Number(params.cost_lte) || DEFAULT_FILTERS.cost_lte,
			ratings_gte: Number(params.ratings_gte) || DEFAULT_FILTERS.ratings_gte,
		});
	}, [params, setValues]);

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

	const submitHandler = (filters = {}) => {
		const url = urlFormatter('/products', { ...filters, ...pagination });
		router.replace(url, undefined, { shallow: true });
	};

	const resetHandler = () => {
		setValues(DEFAULT_FILTERS);
		submitHandler();
	};

	const openOverlay = (type: 'filter' | 'sort') => {
		document.body.style.overflow = 'hidden';
		setShowPopup(type);
	};

	return (
		<>
			{/* Mobile */}
			<div className='bg-white block lg:hidden px-5 py-10'>
				<div className='lg:hidden flex gap-5 items-center justify-between'>
					<Input
						placeholder='kiếm cái nịt'
						icon={<IconSearch className='w-5' />}
						className='flex-1'
					/>
					<div>
						<IconShoppingCart color='purple' />
					</div>
					<div>
						<IconBrandWechat color='purple' />
					</div>
				</div>
				<div className='lg:hidden flex gap-5 mt-5 w-max overflow-x-auto max-w-full items-center'>
					<h3 className='font-bold w-max whitespace-nowrap'>Trending search:</h3>
					<Badge className='overflow-visible'>Cho Nhan</Badge>
					<Badge className='overflow-visible'>Cho Nhan</Badge>
					<Badge className='overflow-visible'>Cho Nhan</Badge>
					<Badge className='overflow-visible'>Cho Nhan</Badge>
					<Badge className='overflow-visible'>Cho Nhan</Badge>
					<Badge className='overflow-visible'>Cho Nhan</Badge>
				</div>
				<div className='bg-white flex items-center gap-x-4 lg:hidden mt-5'>
					<Button
						className='flex-1'
						variant='outline'
						onClick={() => openOverlay('filter')}
						leftIcon={<IconFilter />}
					>
						Bộ lọc
					</Button>
					<Button
						className='flex-1'
						variant='outline'
						onClick={() => openOverlay('sort')}
						leftIcon={<IconSortAscendingLetters />}
					>
						Sắp xếp
					</Button>
				</div>
			</div>
			<Layout>
				{showPopup && (
					<div
						className='fixed top-0 left-0 bg-black/50 w-screen h-screen z-10'
						onClick={() => {
							console.log(document.body.style.overflow);
							document.body.style.overflow = 'auto';
							setShowPopup('');
						}}
					>
						{showPopup === 'sort' && <MobileSort onSort={onSort} options={SORT_OPTIONS} />}
						{showPopup === 'filter' && (
							<MobileFilter
								form={form}
								categories={categories}
								resetHandler={resetHandler}
								submitHandler={submitHandler}
							/>
						)}
					</div>
				)}
				{/* Desktop */}
				<div className='hidden lg:flex justify-between items-center px-5 lg:px-10 gap-10'>
					<h1 className='gradient bg-clip-text text-transparent font-bold text-4xl'>Artiexh</h1>
					<Input
						icon={<IconSearch className='w-5' />}
						placeholder='Kiếm cái nịt'
						className='flex-1 h-14'
						classNames={{ input: 'h-full' }}
					/>
					<div>
						<IconShoppingCart color='purple' size='2.5rem' />
					</div>
				</div>
				<h2 className='lg:text-3xl mt-10 lg:mt-10 font-bold lg:px-10'>Tất cả sản phẩm</h2>
				<div className='grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12 mt-4 lg:px-10'>
					<Sidebar
						submitHandler={submitHandler}
						categories={categories}
						resetHandler={resetHandler}
						form={form}
					/>
					<div className='col-span-9'>
						<div className='justify-between items-center hidden lg:flex'>
							<div className='flex gap-3'>
								<Badge>Cho nhan</Badge>
								<Badge>Cho nhan</Badge>
								<Badge>Cho nhan</Badge>
								<Badge>Cho nhan</Badge>
							</div>
							<Select
								data={SORT_OPTIONS}
								onChange={onSort}
								value={`${pagination._sort}_${pagination._order}`}
							/>
						</div>
						<div className={clsx(productStyles['product-list-grid'], 'col-span-4 lg:mt-10')}>
							{products?.length ? (
								products?.map((product, index) => <ProductPreviewCard data={product} key={index} />)
							) : (
								<div className='col-span-4'>
									<h2 className='text-lg font-semibold text-centers'>
										Cannot find any items matching the criteria
									</h2>
								</div>
							)}
							{/* Chen infinite scroll cua @kekkei9 */}
						</div>
					</div>
				</div>
			</Layout>
		</>
	);
};

export default ProductListContainer;
