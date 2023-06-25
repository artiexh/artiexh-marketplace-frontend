import { Category } from '@/types/Product';
import clsx from 'clsx';
import { FC } from 'react';

type CategoryItemProps = {
	category: Category;
	active: boolean;
	setActiveCategory: (id: string) => void;
};

const CategoryItem: FC<CategoryItemProps> = ({ active, category, setActiveCategory }) => {
	return (
		<div
			className={clsx(
				active ? 'text-primary font-medium' : 'text-subtext hover:text-primary',
				'cursor-pointer'
			)}
			key={category.id}
			onClick={() => setActiveCategory(category.id)}
		>
			{category.name}
		</div>
	);
};

export default CategoryItem;
