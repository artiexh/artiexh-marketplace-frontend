import ProductListContainer from "@/containers/ProductListContainer/ProductListContainer";
import axiosClient from "@/services/backend/axiosClient";
import { Category, Tag } from "@/types/Product";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { GetStaticPaths, InferGetStaticPropsType, NextPage } from "next";
import { useSearchParams } from "next/navigation";

const ShopProductListPage: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ categories, tags }) => {
  const params = useSearchParams();
  const name = params?.get("name");

  return (
    <ProductListContainer
      endpoint={`marketplace/artist/${name}/product`}
      categories={categories}
      tags={tags}
      pathName={`/shop/${name}/product`}
    />
  );
};

export default ShopProductListPage;

export async function getStaticProps() {
  const [{ data: categories }, { data: tags }] = await Promise.all([
    axiosClient.get<CommonResponseBase<PaginationResponseBase<Category>>>(
      "/category"
    ),
    axiosClient.get<CommonResponseBase<PaginationResponseBase<Tag>>>("/tag"),
  ]);

  return {
    props: { categories: categories.data.items, tags: tags.data.items },
    revalidate: 10
  };
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};
