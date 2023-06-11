import { FC, HTMLAttributes } from 'react';

export type BadgeProps = HTMLAttributes<HTMLDivElement>;

const Badge: FC<BadgeProps> = ({ children }) => {
	return (
		<div className='p-[2px] rounded-full gradient flex items-center justify-center'>
			<div className='bg-white rounded-full px-2 py-1 text-xs w-max'>{children}</div>
		</div>
	);
};

export default Badge;
