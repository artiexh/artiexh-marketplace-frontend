/* eslint-disable @next/next/no-img-element */
import ProductPreviewCard from "@/components/Cards/ProductCard/ProductPreviewCard";
// import { campaignData } from "@/constants/campaign";
import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import NotFoundComponent from "@/components/NotFoundComponents/NotFoundComponent";
import Timer from "@/components/Timer/Timer";
import { CAMPAIGN_TYPE_DATA } from "@/constants/campaign";
import { notfoundMessages } from "@/constants/notfoundMesssages";
import axiosClient from "@/services/backend/axiosClient";
import { getMarketplaceCampaignById } from "@/services/backend/services/campaign";
import productStyles from "@/styles/Products/ProductList.module.scss";
import { CampaignDetailResponse } from "@/types/Campaign";
import { Product } from "@/types/Product";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { getCampaignTime } from "@/utils/date";
import { getCampaignType } from "@/utils/mapper";
import { Button } from "@mantine/core";
import { IconBuildingFactory } from "@tabler/icons-react";
import { IconSparkles } from "@tabler/icons-react";
import clsx from "clsx";
import * as DOMPurify from "dompurify";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CampaignDetailPage() {
  const params = useSearchParams();
  const id = params?.get("id");
  // const campaign = campaignData[0];
  const router = useRouter();

  const [campaignData, setCampaignData] = useState<CampaignDetailResponse>();
  const [campaignProducts, setCampaignProducts] = useState<Product[]>([]);

  const initCampaignData = async () => {
    if (!id) return;

    const result = await getMarketplaceCampaignById(id);

    if (result != null) {
      setCampaignData(result);

      const productRes = await axiosClient.get<
        CommonResponseBase<PaginationResponseBase<Product>>
      >(`/marketplace/sale-campaign/${id}/product-in-sale?pageSize=6`);

      if (productRes.data.data.items.length) {
        setCampaignProducts(productRes.data.data.items);
      }
    }
  };

  useEffect(() => {
    initCampaignData();
  }, [id]);

  // const { data: products } = useSWR("products", async () => {
  //   return axiosClient
  //     .get<CommonResponseBase<PaginationResponseBase<Product>>>(`/product`)
  //     .then((res) => res.data.data);
  // });

  if (!campaignData) return <></>;

  return (
    <div className="campaign-detail-page">
      <div
        className={clsx(
          "flex md:hidden justify-center px-10 py-2 text-white font-semibold items-center mb-4",
          CAMPAIGN_TYPE_DATA[getCampaignType(campaignData)].bannerStyle
        )}
      >
        <div className="flex items-center">
          <div className="min-w-[100px]">
            {CAMPAIGN_TYPE_DATA[getCampaignType(campaignData)].title}{" "}
          </div>
          {getCampaignTime(
            campaignData.from,
            campaignData.to,
            getCampaignType(campaignData)
          ) && (
            <Timer
              initValue={getCampaignTime(
                campaignData.from,
                campaignData.to,
                getCampaignType(campaignData)
              )}
            />
          )}
        </div>
      </div>
      <div className="relative">
        <ImageWithFallback
          src={campaignData.thumbnailUrl}
          alt="campaign-thumbnail"
          className="!w-full h-[25rem] object-cover brightness-75"
          width={300}
          height={300}
        />
        <div className="absolute bottom-0 text-white opacity-80 w-full pl-10 py-10">
          <div className="text-[24px] font-bold">{campaignData.name}</div>
          <div className="text-sm">{campaignData.owner.displayName}</div>
          {campaignData.type === "PRIVATE"
            ? `Chỉ có ở Shop`
            : campaignData.type === "PUBLIC"
            ? "Chỉ có ở Arty"
            : undefined}
        </div>
      </div>

      <div className="bg-white shadow p-8 rounded relative">
        <div className="text-2xl font-semibold ">Giới thiệu</div>
        <div className=" mt-1 font-light">{campaignData.description}</div>
        <div
          className={clsx(
            "absolute -top-12 right-0 hidden md:flex justify-center px-6 py-4 text-white font-semibold items-center mb-4 ",

            "rounded-l-lg !bg-[#FDF4F7]"
          )}
        >
          <div className="flex items-center gap-x-3">
            <div className="w-fit whitespace-nowrap text-xl text-black">
              {CAMPAIGN_TYPE_DATA[getCampaignType(campaignData)].title}:
            </div>
            {getCampaignTime(
              campaignData.from,
              campaignData.to,
              getCampaignType(campaignData)
            ) && (
              <Timer
                key={campaignData.from}
                className="!text-3xl "
                initValue={getCampaignTime(
                  campaignData.from,
                  campaignData.to,
                  getCampaignType(campaignData)
                )}
                classNames={{
                  root: "items-center",
                  element: "!p-4 !rounded-md !bg-primary",
                }}
              />
            )}
          </div>
        </div>
      </div>
      <div className="mt-16">
        <div className="flex justify-between items-center mb-4">
          <div className="font-bold text-xl">Những sản phẩm nổi bật</div>
          <div
            className="text-end mb-4 cursor-pointer"
            onClick={() =>
              router.push(`/campaigns/${params?.get("id")}/product`)
            }
          >
            Xem tất cả
          </div>
        </div>

        <div
          className={clsx(
            productStyles["product-list-grid"],
            "col-span-4 lg:!grid-cols-6"
          )}
        >
          {campaignProducts?.length ? (
            campaignProducts?.map((product, index) => (
              <ProductPreviewCard data={product} key={index} />
            ))
          ) : (
            <div className="col-span-full">
              <NotFoundComponent title={notfoundMessages.NOT_FOUND_PRODUCTS} />
            </div>
          )}
        </div>
      </div>

      <div className="mt-10">
        <div className="font-bold text-xl">Có gì hot?</div>
        <div className="flex gap-x-4 mt-4">
          <div className="flex flex-col md:flex-row justify-between w-full gap-x-4 gap-y-3">
            <div className="flex flex-1 gap-x-4 bg-white  shadow py-4 px-6 rounded">
              <div className="bg-primary w-fit h-fit p-3 rounded-xl">
                <IconSparkles size={36} color="white" />
              </div>
              <div>
                <div className="text-xl font-semibold">
                  Chiến dịch: {campaignData.type}
                </div>
                {campaignData.type === "PRIVATE"
                  ? `Chiến dịch độc quyền chỉ bán duy nhất tại hệ thống Marketplace của Arty!`
                  : campaignData.type === "PUBLIC"
                  ? "Chiến dịch độc quyền chỉ bán duy nhất tại Shop riêng của Artist!"
                  : "Dễ dàng mua sắm nhanh chóng ở mọi nơi trong nền tảng của Arty!"}
              </div>
            </div>
            <div className="flex flex-1 gap-x-4 bg-white  shadow py-4 px-6 rounded">
              <div className="bg-primary w-fit h-fit p-3 rounded-xl">
                <IconBuildingFactory size={36} color="white" />
              </div>
              <div>
                <div className="text-xl font-semibold">Chất lượng sản xuất</div>
                Chất lượng sản phẩm được đảm bảo bởi Arty và các bên cung cấp.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-x-6 gap-y-6 mt-5">
        <div
          className=" bg-white shadow p-8 rounded w-full md:w-[14rem] h-fit md:sticky md:top-28 cursor-pointer"
          onClick={() =>
            router.push(`/shop/${campaignData.owner.username}/home`)
          }
        >
          <div className="relative">
            <ImageWithFallback
              src={campaignData.owner.avatarUrl}
              className="w-[120px] h-[120px] object-cover rounded-full mx-auto"
              alt="img"
              width={120}
              height={120}
            />
          </div>
          <div className="px-8 ">
            <div className="mt-6 text-center font-bold text-xl">
              {campaignData.owner.displayName}
            </div>
            <div className="text-gray-500 text-center">
              @{campaignData.owner.username}
            </div>
          </div>
        </div>
        <div className="bg-white  shadow p-10 rounded flex-1">
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                campaignData.content
                  ? campaignData.content
                  : "Không có nội dung"
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
}
