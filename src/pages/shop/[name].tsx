/* eslint-disable @next/next/no-img-element */
import ProductListContainer from "@/containers/ProductListContainer/ProductListContainer";
import axiosClient from "@/services/backend/axiosClient";
import { Category, Product, Tag } from "@/types/Product";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { Shop } from "@/types/Shop";
import { getQueryString } from "@/utils/formatter";
import { Button, Divider, Rating } from "@mantine/core";
import { GetStaticPaths, InferGetStaticPropsType, NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";

const ShopDetailPage: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ categories, tags }) => {
  const router = useRouter();
  const { name, ...params } = router.query;

  const [pagination, setPagination] = useState({
    pageSize: 8,
    pageNumber: 1,
    sortBy: "id",
    sortDirection: "DESC",
  });

  const { data } = useSWR([name], async () => {
    try {
      const res = await axiosClient.get<CommonResponseBase<Shop>>(
        `/shop/${name}`
      );

      return res.data.data;
    } catch (err) {
      console.log(err);
    }
  });

  const { data: products, isLoading } = useSWR(
    [JSON.stringify(pagination) + JSON.stringify(params)],
    (key) =>
      axiosClient
        .get<CommonResponseBase<PaginationResponseBase<Product>>>(
          `/shop/${name}/product?${getQueryString(
            {
              ...pagination,
              ...params,
            },
            []
          )}`
        )
        .then((res) => res.data.data)
  );

  if (data == null) return <></>;

  return (
    <>
      <div className="shop-detail-page md:flex justify-between gap-10">
        <div className="bg-white p-10 w-full rounded-lg relative h-fit">
          <div>
            <img
              className="!w-full h-[150px] absolute !left-0 !top-0 rounded-tl-lg rounded-tr-lg object-cover"
              src={
                "https://i.pinimg.com/originals/17/fe/5a/17fe5ae5192da8d46fcffaed374e168a.png"
              }
              alt="img"
            />
          </div>
          <div>
            <img
              className="rounded-full !w-[100px] !h-[100px] z-10 relative top-10"
              src={data.shopImageUrl}
              alt="img"
            />
          </div>
          <div className="flex items-center justify-between mt-10">
            <div>
              <div className="font-bold mt-4">{data.shopName}</div>
              <Rating defaultValue={4} readOnly />
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mt-4">
              We are the shop known for selling best Japanese merchandise with
              lovely price
            </div>
          </div>
          <Divider className="mt-4" />
          <div className="mt-4 text-sm">Contact number: {data.shopPhone}</div>
          <div className="flex justify-center mt-6 !text-sm">
            <Button
              className="bg-primary text-center !text-white"
              onClick={() => router.push(`/profile/${data.owner.username}`)}
            >
              View profile
            </Button>
          </div>
        </div>
      </div>
      <ProductListContainer
        endpoint={`shop/${name}/product`}
        categories={categories}
        tags={tags}
        pathName={`/shop/${name}`}
      />
    </>
  );
};

export default ShopDetailPage;

export async function getStaticProps() {
  const [{ data: categories }, { data: tags }] = await Promise.all([
    axiosClient.get<CommonResponseBase<PaginationResponseBase<Category>>>(
      "/category"
    ),
    axiosClient.get<CommonResponseBase<PaginationResponseBase<Tag>>>("/tag"),
  ]);

  return {
    props: { categories: categories.data.items, tags: tags.data.items },
  };
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};
