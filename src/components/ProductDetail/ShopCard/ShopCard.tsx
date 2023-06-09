import { ArtistInfo } from '@/types/Product';
import { FC } from 'react';
import { Rating } from '@mantine/core';

type ArtistInfoProps = {
	artist: ArtistInfo;
};

const ShopCard: FC<ArtistInfoProps> = ({ artist }) => {
	return (
		<div className='rounded-full p-5 bg-white flex w-[24rem] h-max'>
			<div className='w-20 gradient aspect-square rounded-full'></div>
			<div className='flex flex-col ml-5'>
				<h3 className='text-2xl font-bold'>{artist.displayName}</h3>
				<Rating value={artist.rating} color='customPrimary' readOnly />
			</div>
		</div>
	);
};

export default ShopCard;
