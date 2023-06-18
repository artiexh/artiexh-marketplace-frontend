import clsx from 'clsx';
import { FC, HTMLAttributes } from 'react';

export type BadgeProps = HTMLAttributes<HTMLDivElement> & {
	size?: string;
};

const Badge: FC<BadgeProps> = ({ children, className, size = 'text-xs' }) => {
	return (
		<div
			className={clsx(
				'p-[2px] rounded-full gradient flex items-center justify-center w-max',
				className
			)}
		>
			<div className={clsx('bg-white rounded-full px-2 py-1 w-full', size)}>{children}</div>
		</div>
	);
};

export default Badge;
