/* eslint-disable @next/next/no-img-element */
import axiosClient from "@/services/backend/axiosClient";
import { Product } from "@/types/Product";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { Shop } from "@/types/Shop";
import { getQueryString } from "@/utils/formatter";
import { Rating, Divider, Button, clsx, Pagination } from "@mantine/core";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";
import productStyles from "@/styles/Products/ProductList.module.scss";
import ProductPreviewCard from "@/components/Cards/ProductCard/ProductPreviewCard";

export default function ShopDetailPage() {
  const router = useRouter();
  const { id, ...params } = router.query;

  const [pagination, setPagination] = useState({
    pageSize: 8,
    pageNumber: 1,
    sortBy: "id",
    sortDirection: "DESC",
  });

  const { data } = useSWR([id], async () => {
    try {
      const res = await axiosClient.get<CommonResponseBase<Shop>>(
        `/shop/${id}`
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
          `/product?${getQueryString(
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
        <div className="bg-white p-10 md:w-[240px] rounded-lg relative h-fit">
          <div>
            <img
              className="!w-full h-[100px] absolute !left-0 !top-0 rounded-tl-lg rounded-tr-lg"
              src={
                "https://i.pinimg.com/originals/17/fe/5a/17fe5ae5192da8d46fcffaed374e168a.png"
              }
              alt="img"
            />
          </div>
          <div>
            <img
              className="rounded-full !w-[100px] !h-[100px] z-10 relative"
              src={data.shopImageUrl}
              alt="img"
            />
          </div>

          <div className="flex items-center justify-between">
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
              onClick={() => router.push(`/profile/${data.owner.id}`)}
            >
              View profile
            </Button>
          </div>
        </div>
        <div className="flex-1 mt-10 md:mt-0">
          <div
            className={clsx(productStyles["product-list-grid"], "col-span-4")}
          >
            {products?.items?.length ? (
              products.items?.map((product, index) => (
                <ProductPreviewCard data={product} key={index} />
              ))
            ) : (
              <div className="col-span-4">
                <h2 className="text-lg font-semibold text-centers">
                  Cannot find any items matching the criteria
                </h2>
              </div>
            )}
          </div>
          <div className="flex justify-center mt-6 mb-20">
            <Pagination
              value={pagination.pageNumber}
              onChange={(e) => {
                const url = getQueryString(
                  {
                    ...pagination,
                    ...params,
                    pageNumber: e,
                  },
                  []
                );
                router.replace(`/shop/${id}?${url}`, undefined, {
                  shallow: true,
                });
                setPagination((prev) => ({ ...prev, pageNumber: e }));
              }}
              total={products?.totalPage ?? 0}
            />
          </div>
        </div>
      </div>
    </>
  );
}
