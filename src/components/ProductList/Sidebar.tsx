import { Category } from '@/types/Product';
import { Button, Checkbox, Divider, NumberInput, Rating } from '@mantine/core';
import clsx from 'clsx';
import { FC, useEffect, useState } from 'react';
import CategoryItem from './CategoryItem';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/router';
import { urlFormatter } from '@/utils/formatter';

type FilterProps = {
	categoryId: string;
	cost_gte: number;
	cost_lte: number;
	ratings_gte: number;
	locations: number[]; // Temp: no way to make this work with JSONSERVER, i dont want to code BE
};

type SidebarProps = {
	categories: Category[];
	pagination: any; // lazy
};

const MAX_CATEGORIES = 5;

const DEFAULT_FILTERS: Partial<FilterProps> = {
	cost_gte: 0,
	cost_lte: 100_000_000,
	ratings_gte: 0,
	categoryId: '',
};

const Sidebar: FC<SidebarProps> = ({ categories, pagination }) => {
	const [moreCategories, setMoreCategories] = useState(false);
	const [moreLocations, setMoreLocations] = useState(false);
	const router = useRouter();

	const {
		values: filters,
		getInputProps,
		setFieldValue,
		setValues,
	} = useForm<Partial<FilterProps>>({
		initialValues: DEFAULT_FILTERS,
	});

	const submitHandler = (values = filters) => {
		const url = urlFormatter('/products', { ...values, ...pagination });
		router.replace(url, undefined, { shallow: true });
	};

	useEffect(() => {
		setValues({
			categoryId: (router.query.categoryId as string) || DEFAULT_FILTERS.categoryId,
			cost_gte: Number(router.query.cost_gte) || DEFAULT_FILTERS.cost_gte,
			cost_lte: Number(router.query.cost_lte) || DEFAULT_FILTERS.cost_lte,
			ratings_gte: Number(router.query.ratings_gte) || DEFAULT_FILTERS.ratings_gte,
		});
	}, [router, setValues]);

	return (
		<nav className='hidden lg:block col-span-3'>
			<div className='flex justify-between items-center'>
				<h2 className='font-bold text-xl'>Bộ lọc</h2>
				<Button
					variant='outline'
					size='xs'
					onClick={() => {
						setValues(DEFAULT_FILTERS);
						submitHandler(pagination);
					}}
				>
					Xóa tất cả
				</Button>
			</div>
			<Divider className='my-3' />
			<h3 className='font-bold text-lg'>Khoảng giá</h3>
			<div className='flex mt-2 items-center justify-between'>
				<NumberInput
					hideControls
					// classNames={{ input: 'rounded-sm' }}
					placeholder='100.000'
					{...getInputProps('cost_gte')}
				/>
				<span className='mx-2'>-</span>
				<NumberInput
					hideControls
					// classNames={{ input: 'rounded-sm' }}
					placeholder='1.000.000'
					{...getInputProps('cost_lte')}
				/>
			</div>
			<Divider className='my-3' />
			<h3 className='font-bold text-lg'>Đánh giá</h3>
			<div className='flex items-center gap-3'>
				<Rating color='purple' {...getInputProps('ratings_gte')} />
				<span className='text-subtext text-sm'>trở lên</span>
			</div>
			<Divider className='my-3' />
			<h3 className='font-bold text-lg'>Danh mục</h3>
			<div className='flex flex-col gap-3 mt-3'>
				{categories.slice(0, MAX_CATEGORIES).map((category, index) => (
					<CategoryItem
						key={category.id}
						category={category}
						active={filters.categoryId === category.id}
						setActiveCategory={(id) => setFieldValue('categoryId', id)}
					/>
				))}
				{moreCategories &&
					categories
						.slice(MAX_CATEGORIES)
						.map((category, i) => (
							<CategoryItem
								key={category.id}
								category={category}
								active={filters.categoryId === category.id}
								setActiveCategory={(id) => setFieldValue('categoryId', id)}
							/>
						))}
				{categories.length > 5 && (
					<div
						className='text-subtext cursor-pointer hover:text-primary'
						onClick={() => setMoreCategories(!moreCategories)}
					>
						{moreCategories ? 'Bớt UP' : 'Thêm DOWN'}
					</div>
				)}
			</div>
			<Divider className='my-3' />
			<h3 className='font-bold text-lg'>Nơi bán</h3>
			<Checkbox.Group className='flex flex-col gap-3 mt-3' {...getInputProps('locations')}>
				{categories.slice(0, MAX_CATEGORIES).map((category, index) => (
					<Checkbox key={category.id} label={`Thành phố ${index + 1}`} value={category.id} />
				))}
				{moreLocations &&
					categories
						.slice(MAX_CATEGORIES)
						.map((category, index) => (
							<Checkbox
								key={category.id}
								label={`Thành phố ${index + 1 + MAX_CATEGORIES}`}
								value={category.id}
								className='cursor-pointer'
							/>
						))}
				{categories.length > 5 && (
					<div
						className='text-subtext cursor-pointer hover:text-primary'
						onClick={() => setMoreLocations(!moreLocations)}
					>
						{moreLocations ? 'Bớt UP' : 'Thêm DOWN'}
					</div>
				)}
			</Checkbox.Group>
			<Divider className='my-3' />
			<Button className='bg-primary w-full' onClick={() => submitHandler(filters)}>
				Apply
			</Button>
		</nav>
	);
};

export default Sidebar;
