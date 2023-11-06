/* eslint-disable @next/next/no-img-element */
import ProductPreviewCard from "@/components/Cards/ProductCard/ProductPreviewCard";
// import { campaignData } from "@/constants/campaign";
import axiosClient from "@/services/backend/axiosClient";
import { getMarketplaceCampaignById } from "@/services/backend/services/campaign";
import productStyles from "@/styles/Products/ProductList.module.scss";
import { CampaignDetailResponse } from "@/types/Campaign";
import { Product } from "@/types/Product";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { Button } from "@mantine/core";
import clsx from "clsx";
import * as DOMPurify from "dompurify";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Timer from "@/components/Timer/Timer";
import { IconChevronLeft } from "@tabler/icons-react";
import { CAMPAIGN_TYPE_DATA } from "@/constants/campaign";
import { getCampaignTime } from "@/utils/date";
import { getCampaignType } from "@/utils/mapper";

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
      >(`/marketplace/campaign/${id}/product?pageSize=4`);

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
          "flex justify-center px-10 py-2 text-white font-semibold items-center mb-4",
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
        <img
          src={campaignData.thumbnailUrl}
          alt="campaign-thumbnail"
          className="w-full h-[300px] object-cover brightness-75"
        />
        <div className="absolute w-full h-full top-0 flex justify-center items-center">
          <div>
            <div className="text-white font-bold text-4xl">
              {campaignData.name}
            </div>
            <div className="text-white text-lg mt-2 text-center">
              By: {campaignData.owner.displayName}
            </div>
            <div className="flex justify-center mt-4">
              <Button
                className="!bg-white !text-black"
                onClick={() =>
                  router.push(`/shop/${campaignData.owner.username}`)
                }
              >
                View shop
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-8 text-2xl font-semibold">
        Sản phẩm tiêu biểu
      </div>
      <div
        className="text-end mb-4 cursor-pointer"
        onClick={() => router.push(`/campaigns/${params?.get("id")}/product`)}
      >
        Xem tất cả
      </div>
      <div
        className={clsx(
          productStyles["product-list-grid"],
          "col-span-4 lg:!grid-cols-5"
        )}
      >
        {campaignProducts?.length ? (
          campaignProducts?.map((product, index) => (
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
      <div className="text-center mt-12 text-2xl font-semibold">Giới thiệu</div>
      <div className="text-center mt-2 px-20">{campaignData.description}</div>
      <div className="flex justify-center gap-10 mt-8">
        <div className="w-[300px] shadow-md rounded-lg">
          <div>
            <img
              src={campaignData.owner.avatarUrl}
              alt="artist"
              className="w-full h-[300px] rounded-tl-lg rounded-tr-lg"
            />
          </div>
          <div className="p-4">
            <span className="font-semibold">Artist: </span>
            {campaignData.owner.displayName}
          </div>
        </div>
        <div className="w-[300px] shadow-md rounded-lg">
          <div>
            <img
              // src="https://quocluat.vn/photos/blog_post/Printing.jpg"
              src={campaignData.provider.imageUrl}
              alt="artist"
              className="w-full h-[300px] rounded-tl-lg rounded-tr-lg"
            />
          </div>
          <div className="p-4">
            <span className="font-semibold">Provider: </span>{" "}
            {campaignData.provider.businessName}
          </div>
        </div>
      </div>
      <div className="text-center mt-20 text-2xl font-semibold">Nội dung</div>
      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(campaignData.content),
        }}
      />
    </div>
  );
}
