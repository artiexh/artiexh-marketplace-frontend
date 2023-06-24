import Image from "next/image";
import styles from "./ProductPreviewCard.module.scss";
import { Product } from "@/types/Product";
import { currencyFormatter } from "@/utils/formatter";
import clsx from "clsx";

interface IProductPreviewCardProps {
  data: Product;
  className?: string;
}

const ProductPreviewCard = ({ data, className }: IProductPreviewCardProps) => {
	return (
		<div
			className={clsx(
				styles['product-preview-card'],
				'bg-white rounded-2xl aspect-3/5 w-full',
				className
			)}
		>
			<div className='relative w-full aspect-square'>
				<Image
					className=' rounded-2xl rounded-bl-none object-cover'
					src={'/assets/carue.png'}
					alt='dogtor'
					fill
					sizes='(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw'
				/>
			</div>
			<div className='p-2.5 sm:p-6 sm:text-xl md:p-4 md:text-xl'>
				<div className='font-semibold'>{data?.name}</div>
				<div className='text-slate-400 text-base'>{data?.ownerInfo.displayName}</div>
				<div className='text-right mt-2.5 md:mt-6 font-semibold'>
					{isNaN(Number(data.price.value)) ? 'N/A' : currencyFormatter('vn-VN', data.price)}
				</div>
			</div>
		</div>
	);
};

export default ProductPreviewCard;
