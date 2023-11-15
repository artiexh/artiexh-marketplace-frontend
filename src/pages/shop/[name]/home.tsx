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
import ShopTabsContainer from "@/containers/ShopTabsContainer/ShopTabsContainer";

const ARTY_SHOP_NAME = "arty-shop";

const ShopDetailPage = () => {
  const router = useRouter();
  const { name, ...params } = router.query;

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
          >(
            `/marketplace/sale-campaign?pageSize=4&ownerId=${res.data.data.id}`
          ),
          axiosClient.get<CommonResponseBase<PaginationResponseBase<Product>>>(
            `/marketplace/artist/${name}/product-in-sale?pageSize=4`
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
  console.log(data);

  if (data == null) return <></>;

  return (
    <div className="user-profile-page relative">
      <div className="hidden md:block">
        <img
          className="w-full h-[200px] object-cover"
          src={
            data.shopThumbnailUrl ??
            "https://i.pinimg.com/originals/ee/26/8c/ee268cf73e3850486966244fe34605d6.png"
          }
          alt="img"
        />
      </div>
      <div className="md:flex gap-10">
        <div className="relative md:-top-20 md:left-10">
          <div className="bg-white w-full md:w-[300px] pb-20 md:pb-0 rounded-lg relative">
            <div>
              <div className="md:hidden absolute w-full">
                <img
                  className="w-full h-[200px] object-cover"
                  src={
                    data.shopThumbnailUrl ??
                    "https://i.pinimg.com/originals/ee/26/8c/ee268cf73e3850486966244fe34605d6.png"
                  }
                  alt="img"
                />
              </div>
              <div className="relative top-20 md:top-0">
                <div className="pt-12 relative">
                  <img
                    src={
                      data.avatarUrl ??
                      "https://cdn.hero.page/pfp/5e92df9f-2fe9-4b7e-a87a-ba503fe458d2-charming-sakura-inspired-avatar-kawaii-anime-avatar-creations-1.png"
                    }
                    className="w-[120px] h-[120px] object-cover rounded-full mx-auto"
                    alt="img"
                  />
                </div>
                <div className="px-8 pb-12">
                  <div className="mt-6 mb-4 text-center font-bold text-xl">
                    {data.displayName}
                  </div>
                  <div className="text-gray-500">{data.description}</div>
                  <Button className="bg-primary !text-white w-full mt-10">
                    Following
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="md:ml-8 flex-1 md:mr-10">
          <div className="mt-5 md:mt-10">
            <ShopTabsContainer />
          </div>
          <div className="flex items-center justify-between mt-10">
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
                "mt-3 lg:!grid-cols-4"
              )}
            >
              {shopProducts?.map((product, index) => (
                <ProductPreviewCard data={product} key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetailPage;
