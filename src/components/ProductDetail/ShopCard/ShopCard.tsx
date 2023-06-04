import { Seller } from '@/types/Product';
import { FC } from 'react';
import { Rating } from '@mantine/core';

type ShopCardProps = {
	shop: Seller;
};

const ShopCard: FC<ShopCardProps> = ({ shop }) => {
	return (
		<div className='rounded-full p-5 bg-white flex w-[24rem] h-max'>
			<div className='w-20 gradient aspect-square rounded-full'></div>
			<div className='flex flex-col ml-5'>
				<h3 className='text-2xl font-bold'>{shop.name}</h3>
				<Rating value={shop.rating} color='customPrimary' readOnly />
			</div>
		</div>
	);
};

export default ShopCard;
