import { Category } from '@/types/Product';
import { Divider, Accordion, NumberInput, Button, Rating, Checkbox } from '@mantine/core';
import { FC, useState } from 'react';
import CategoryItem from './CategoryItem';
import { UseFormReturnType } from '@mantine/form';
import { FilterProps } from '@/services/backend/types/Filter';
import { MAX_CATEGORIES } from '@/constants/ProductList';
import { IconArrowDown, IconArrowRight, IconArrowUp } from '@tabler/icons-react';

type MobileFilterProps = {
	categories: Category[];
	form: UseFormReturnType<Partial<FilterProps>>;
	submitHandler: (filters?: Object) => void;
	resetHandler: () => void;
};

const MobileFilter: FC<MobileFilterProps> = ({ categories, form, submitHandler, resetHandler }) => {
	const { values: filters, setFieldValue, getInputProps } = form;
	const [moreCategories, setMoreCategories] = useState(false);
	const [moreLocations, setMoreLocations] = useState(false);

	return (
		<div
			className='bg-white rounded-t-lg absolute bottom-0 left-0 w-full'
			onClick={(e) => e.stopPropagation()}
		>
			<h3 className='text-center py-3'>Bộ lọc</h3>
			<Divider />
			<Accordion defaultValue='price'>
				<Accordion.Item value='price'>
					<Accordion.Control>Khoảng giá</Accordion.Control>
					<Accordion.Panel>
						<div className='flex items-center justify-center gap-3'>
							<NumberInput
								hideControls
								placeholder='100.000'
								{...getInputProps('cost_gte')}
								className='flex-1'
							/>
							<span className='mx-2'>
								<IconArrowRight />
							</span>
							<NumberInput
								hideControls
								placeholder='1.000.000'
								{...getInputProps('cost_lte')}
								className='flex-1'
							/>
						</div>
					</Accordion.Panel>
				</Accordion.Item>

				<Accordion.Item value='ratings'>
					<Accordion.Control>Đánh giá</Accordion.Control>
					<Accordion.Panel>
						<div className='flex items-center gap-3'>
							<Rating color='purple' {...getInputProps('ratings_gte')} />
							<span className='text-subtext text-sm'>trở lên</span>
						</div>
					</Accordion.Panel>
				</Accordion.Item>

				<Accordion.Item value='category'>
					<Accordion.Control>Danh mục</Accordion.Control>
					<Accordion.Panel>
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
									{moreCategories ? (
										<span className='flex gap-1 items-center'>
											Bớt <IconArrowUp />
										</span>
									) : (
										<span className='flex gap-1 items-center'>
											Thêm <IconArrowDown />
										</span>
									)}
								</div>
							)}
						</div>
					</Accordion.Panel>
				</Accordion.Item>

				<Accordion.Item value='locations'>
					<Accordion.Control>Nơi bán</Accordion.Control>
					<Accordion.Panel>
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
									{moreLocations ? (
										<span className='flex gap-1 items-center'>
											Bớt <IconArrowUp />
										</span>
									) : (
										<span className='flex gap-1 items-center'>
											Thêm <IconArrowDown />
										</span>
									)}
								</div>
							)}
						</Checkbox.Group>
					</Accordion.Panel>
				</Accordion.Item>
			</Accordion>
			<Divider />
			<div className='px-5 py-3 flex gap-3'>
				<Button className='bg-primary w-full h-10' onClick={() => submitHandler(filters)}>
					Áp dụng
				</Button>
				<Button variant='outline' className='w-full h-10' onClick={resetHandler}>
					Xoá tất cả
				</Button>
			</div>
		</div>
	);
};

export default MobileFilter;
