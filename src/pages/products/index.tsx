import ssrAxiosClient from "@/services/backend/axiosMockups/ssrAxiosMockupClient";
import { Product, Tag } from "@/types/Product";
import { GetStaticPropsContext, InferGetStaticPropsType, NextPage } from "next";
import clsx from "clsx";
import { CommonResponseBase } from "@/types/ResponseBase";
import useSWR from "swr";
import axiosClient from "@/services/backend/axiosMockups/axiosMockupClient";
import productStyles from "@/styles/Products/productList.module.scss";
import ProductPreviewCard from "@/components/Cards/ProductCard/ProductPreviewCard";
import Layout from "@/layouts/Layout/Layout";
import { Button } from "@mantine/core";

const ProductListPage: NextPage = () => {
  const { data: products, isLoading } = useSWR(
    ["/products?_limit=10&_page=1"],
    (key) =>
      axiosClient
        .get<CommonResponseBase<Product[]>>(key[0])
        .then((res) => res.data.data)
  );

  return (
    <Layout>
      <div className="bg-white h-14 flex items-center gap-x-4 px-6 lg:hidden w-screen -ml-6">
        <Button className="bg-primary flex-1">Bộ lọc</Button>
        <Button className="bg-primary flex-1">Sắp xếp</Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-4 mt-4 lg:mt-0">
        <div className="col-span-1 h-[80vh] bg-white hidden lg:block"></div>
        <div
          className={clsx(
            productStyles["product-list-grid"],
            "lg:!grid-cols-4 col-span-4"
          )}
        >
          {products?.map((product, index) => (
            <ProductPreviewCard data={product} key={index} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductListPage;
