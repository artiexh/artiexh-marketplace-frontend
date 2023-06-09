import { fetcher } from '@/services/backend/axiosMockups/axiosMockupClient';
import { Category } from '@/types/Product';
import { CommonResponseBase } from '@/types/ResponseBase';
import useSwr from 'swr';

const useCategories = () => {
	const result = useSwr(['categories'], () =>
		fetcher<CommonResponseBase<Category[]>>('/categories')
	);

	return result;
};

export default useCategories;
