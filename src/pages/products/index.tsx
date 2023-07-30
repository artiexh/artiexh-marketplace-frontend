import ProductListContainer from "@/containers/ProductListContainer/ProductListContainer";
import ssrAxiosClient from "@/services/backend/axiosMockups/ssrAxiosMockupClient";
import { Category } from "@/types/Product";
import { CommonResponseBase } from "@/types/ResponseBase";
import { InferGetStaticPropsType, NextPage } from "next";

const ProductListPage: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ categories }) => {
  return <ProductListContainer categories={categories} />;
};

export default ProductListPage;

export async function getStaticProps() {
  // const { data: categories } = await ssrAxiosClient.get<CommonResponseBase<Category[]>>(
  // 	'/categories'
  // );

  const categories = [
    {
      id: "1",
      name: "Category 1",
    },
    {
      id: "2",
      name: "Category 2",
    },
    {
      id: "3",
      name: "Category 3",
    },
    {
      id: "4",
      name: "Category 4",
    },
    {
      id: "5",
      name: "Category 5",
    },
    {
      id: "6",
      name: "Category 6",
    },
    {
      id: "7",
      name: "Category 7",
    },
  ];

  return {
    props: { categories: categories },
  };
}
