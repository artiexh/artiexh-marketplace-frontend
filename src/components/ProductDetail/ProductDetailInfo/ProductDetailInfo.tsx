import { FC } from 'react';

type ProductDetailInfoProps = {
	product: Product;
};

const ProductDetailInfo: FC<ProductDetailInfoProps> = ({ product }) => {
	const { id, ratings, name, price } = product;

	return (
		<div className='rounded-lg p-5'>
			<h1 className=''></h1>
		</div>
	);
};

export default ProductDetailInfo;
