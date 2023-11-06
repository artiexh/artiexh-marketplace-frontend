/* eslint-disable @next/next/no-img-element */
import { CustomBreadcrumbs } from "@/components/Breadcrumbs";
import ProductPreviewCard from "@/components/Cards/ProductCard/ProductPreviewCard";
import Description from "@/components/ProductDetail/Description/Description";
import ProductInfo from "@/containers/ProductInfo/ProductInfo";
import ShopCard from "@/components/ProductDetail/ShopCard/ShopCard";
import axiosClient from "@/services/backend/axiosClient";
import { Product } from "@/types/Product";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { Carousel } from "@mantine/carousel";
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { CAMPAIGN_TYPE_DATA } from "@/constants/campaign";
import { getCampaignTime } from "@/utils/date";
import { getCampaignType } from "@/utils/mapper";
import clsx from "clsx";
import Timer from "@/components/Timer/Timer";
import { IconChevronLeft } from "@tabler/icons-react";
import { Button } from "@mantine/core";

const ProductDetailPage: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ product, relatedProducts }) => {
  const router = useRouter();

  if (router.isFallback) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  const { description, id, attaches, owner, campaign } = product;
  const campaignType = getCampaignType(campaign);
  const campaignTime = getCampaignTime(
    campaign.from,
    campaign.to,
    getCampaignType(campaign)
  );
  const campaignTypeData = CAMPAIGN_TYPE_DATA[campaignType];

  return (
    <>
      <div className="page-wrapper max-w-7xl px-5 md:px-10 mx-auto mt-10 pb-5">
        <div
          className={clsx(
            "flex justify-center px-10 py-2 text-white font-semibold items-center",
            campaignTypeData.bannerStyle
          )}
        >
          {/* <div
            className="text-xl flex gap-1 items-center cursor-pointer"
            onClick={() => router.push(`/campaigns/${campaign.id}`)}
          >
            <IconChevronLeft /> <div>Campaign: {campaign.name}</div>
          </div>
          <div className="flex items-center">
            <div className="min-w-[100px]">{campaignTypeData.title} </div>
            {campaignTime && <Timer initValue={campaignTime} />}
          </div> */}
          <div className="flex items-center">
            <div className="min-w-[100px]">
              {CAMPAIGN_TYPE_DATA[getCampaignType(campaign)].title}{" "}
            </div>
            {getCampaignTime(
              campaign.from,
              campaign.to,
              getCampaignType(campaign)
            ) && (
              <Timer
                initValue={getCampaignTime(
                  campaign.from,
                  campaign.to,
                  getCampaignType(campaign)
                )}
              />
            )}
          </div>
        </div>
        <div className="relative">
          <img
            src={campaign.thumbnailUrl}
            alt="img"
            className="h-[100px] w-full object-cover brightness-75"
          />
          <div
            className="absolute w-full h-full top-0 flex justify-center items-center cursor-pointer"
            onClick={() => router.push(`/campaigns/${campaign.id}`)}
          >
            <div>
              <div className="text-white font-bold text-2xl sm:text-3xl">
                {campaign.name}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-12 md:gap-10 gap-y-5">
          <Carousel
            className="overflow-hidden rounded-lg rounded-tl-none col-span-12 md:col-span-7"
            loop
            withIndicators
            classNames={{
              indicator: "data-[active=true]:gradient bg-gray-300",
            }}
          >
            {attaches.map((image) => (
              <Carousel.Slide key={image.id}>
                <div className="flex h-[250px] sm:h-[460px] bg-white">
                  <Image
                    src={image.url}
                    className="object-contain"
                    alt={image.title}
                    fill
                  />
                </div>
              </Carousel.Slide>
            ))}
          </Carousel>
          <ProductInfo
            key={product.id}
            product={product}
            special={
              product.remainingQuantity > 0
                ? `Số lượng còn lại: ${product.remainingQuantity}`
                : "Đã hết hàng!"
            }
          />
          <Description description={description} />
          <ShopCard className="col-span-12 md:col-span-5" artist={owner} />
        </div>
        <h2 className="font-bold text-lg mt-10">Related products:</h2>
        <div className="interest-wrapper grid grid-cols-4 md:grid-cols-10 gap-5 mt-5">
          {relatedProducts.map((product, index) => (
            <ProductPreviewCard
              className="col-span-2"
              key={product.id + index}
              data={product}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const { params } = context;
  if (!params?.id) return { props: {} };
  const { data } = await axiosClient.get<CommonResponseBase<Product>>(
    `/marketplace/product/${params.id}`
  );

  const { data: productList } = await axiosClient.get<
    CommonResponseBase<PaginationResponseBase<Product>>
  >(`/marketplace/product?category=${data.data.category.id}`);

  return {
    props: {
      product: data.data,
      relatedProducts: productList.data.items.filter(
        (item) => item.id !== data.data.id
      ),
    },
  };
};

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};

export default ProductDetailPage;
