import Badge from '@/components/Badge/Badge';
import { Product } from '@/types/Product';
import { currencyFormatter } from '@/utils/formatter';
import { Rating, NumberInput, Button } from '@mantine/core';
import { FC } from 'react';

type ProductInfoProps = {
	product: Product;
	special?: string;
};

const ProductInfo: FC<ProductInfoProps> = ({ product, special }) => {
	const { id, ratings, name, price, tags } = product;

	return (
		<div className='rounded-lg p-5 md:p-8 bg-white flex flex-col col-span-12 md:col-span-5'>
			<h1 className='text-3xl'>{name}</h1>
			<div className='tag-wrapper flex gap-3 mt-1'>
				{tags.map((tag) => (
					<Badge key={tag}>{tags}</Badge>
				))}
			</div>
			<div className='flex items-center gap-3 mt-3'>
				<div className='font-bold text-xl text-primary'>{ratings}/5</div>
				<Rating value={ratings} size='lg' color='customPrimary' readOnly />
			</div>
			<h2 className='text-4xl mt-5'>{currencyFormatter('vn', price)}</h2>
			{special && <h4 className='text-red-500'>{special}</h4>}
			<div className='mt-10 md:mt-auto flex gap-2 items-center'>
				<span className='text-lg font-semibold'>So luong</span>
				<NumberInput
					classNames={{
						input: 'w-20',
					}}
					defaultValue={1}
					min={1}
				/>
				<span className='text-subtext'>San pham</span>
			</div>
			<div className='flex gap-5 mt-5'>
				<Button className='flex-1 bg-primary'>Buy now</Button>
				<Button className='flex-1' variant='outline'>
					Add to cart
				</Button>
			</div>
		</div>
	);
};

export default ProductInfo;
