import ProductListContainer from "@/containers/ProductListContainer/ProductListContainer";
import axiosClient from "@/services/backend/axiosClient";
import { Category, Tag } from "@/types/Product";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { InferGetStaticPropsType, NextPage } from "next";

const ProductListPage: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ categories, tags }) => {
  console.log(categories);
  return (
    <ProductListContainer
      endpoint="marketplace/product-in-sale"
      categories={categories}
      tags={tags}
      pathName="marketplace/product-in-sale"
    />
  );
};

export default ProductListPage;

export async function getStaticProps() {
  const [{ data: categories }, { data: tags }] = await Promise.all([
    axiosClient.get<CommonResponseBase<PaginationResponseBase<Category>>>(
      "/category"
    ),
    axiosClient.get<CommonResponseBase<PaginationResponseBase<Tag>>>("/tag"),
  ]);

  return {
    props: { categories: categories.data.items, tags: tags.data.items },
    revalidate: 10,
  };
}
