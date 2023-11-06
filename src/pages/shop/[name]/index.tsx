/* eslint-disable @next/next/no-img-element */
import CampaignPreviewCard from "@/components/CampaignPreviewCard/CampaignPreviewCard";
import ProductPreviewCard from "@/components/Cards/ProductCard/ProductPreviewCard";
import axiosClient from "@/services/backend/axiosClient";
import { CampaignData } from "@/types/Campaign";
import { Product } from "@/types/Product";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { User } from "@/types/User";
import { Button, Divider, Rating } from "@mantine/core";
import { clsx } from "clsx";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";
import productStyles from "@/styles/Products/ProductList.module.scss";

const ARTY_SHOP_NAME = "arty-shop";

const ShopDetailPage = () => {
  const router = useRouter();
  const { name, ...params } = router.query;
  console.log(router.query);

  const [campaignList, setCampaignList] = useState<CampaignData[]>([]);

  const [shopProducts, setShopProducts] = useState<Product[]>([]);

  const [pagination, setPagination] = useState({
    pageSize: 8,
    pageNumber: 1,
    sortBy: "id",
    sortDirection: "DESC",
  });

  const { data } = useSWR([name], async () => {
    try {
      const res = await axiosClient.get<CommonResponseBase<User>>(
        `/artist/${name}`
      );

      if (res.data.data != null) {
        Promise.all([
          axiosClient.get<
            CommonResponseBase<PaginationResponseBase<CampaignData>>
          >(`/marketplace/campaign?pageSize=4&ownerId=${res.data.data.id}`),
          axiosClient.get<CommonResponseBase<PaginationResponseBase<Product>>>(
            `/marketplace/product?pageSize=4`
          ),
        ]).then((res) => {
          if (res[0].data.data.items.length) {
            setCampaignList(res[0].data.data.items);
          }

          if (res[1].data.data.items.length) {
            setShopProducts(res[1].data.data.items);
          }
        });
      }

      return res.data.data;
    } catch (err) {
      console.log(err);
    }
  });

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
              src={data.avatarUrl}
              alt="img"
            />
          </div>
          <div className="flex items-center justify-between mt-10">
            <div>
              <div className="font-bold mt-4">{data.displayName}</div>
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
          <div className="flex justify-center mt-6 !text-sm">
            <Button
              className="bg-primary text-center !text-white"
              onClick={() => router.push(`/profile/${data.username}`)}
            >
              View profile
            </Button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-20">
        <div className="font-semibold text-2xl">Campaign đang diễn ra</div>
        <div
          className="text-sm cursor-pointer"
          onClick={() => {
            router.push(`/shop/${data.username}/campaigns`);
          }}
        >
          Xem tất cả
        </div>
      </div>
      <div className={clsx("mt-3 grid !grid-cols-1 gap-8 !md:hidden")}>
        {campaignList
          ?.filter((item, idx) => idx <= 1)
          .map((campaign, index) => (
            <CampaignPreviewCard campaign={campaign} key={index} />
          ))}
      </div>
      <div>
        <div className="flex items-center justify-between mt-20">
          <div className="font-semibold text-2xl">Sản phẩm của shop</div>
          <div
            className="text-sm cursor-pointer"
            onClick={() => {
              router.push(`/shop/${data.username}/products`);
            }}
          >
            Xem tất cả
          </div>
        </div>
        <div
          className={clsx(
            productStyles["product-list-grid"],
            "mt-3 lg:!grid-cols-6"
          )}
        >
          {shopProducts?.map((product, index) => (
            <ProductPreviewCard data={product} key={index} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ShopDetailPage;
