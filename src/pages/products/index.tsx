import ProductListContainer from '@/containers/ProductListContainer/ProductListContainer';
import ssrAxiosClient from '@/services/backend/axiosMockups/ssrAxiosMockupClient';
import { Category } from '@/types/Product';
import { CommonResponseBase } from '@/types/ResponseBase';
import { InferGetStaticPropsType, NextPage } from 'next';

const ProductListPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
	categories,
}) => {
	return <ProductListContainer categories={categories} />;
};

export default ProductListPage;

export async function getStaticProps() {
	const { data: categories } = await ssrAxiosClient.get<CommonResponseBase<Category[]>>(
		'/categories'
	);

	return {
		props: { categories: categories.data },
	};
}
