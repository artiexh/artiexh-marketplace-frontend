/* eslint-disable @next/next/no-img-element */
import ProductPreviewCard from "@/components/Cards/ProductCard/ProductPreviewCard";
import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import NotFoundComponent from "@/components/NotFoundComponents/NotFoundComponent";
import Description from "@/components/ProductDetail/Description/Description";
import ShopCard from "@/components/ProductDetail/ShopCard/ShopCard";
import Timer from "@/components/Timer/Timer";
import { CAMPAIGN_TYPE_DATA } from "@/constants/campaign";
import { notfoundMessages } from "@/constants/notfoundMesssages";
import ProductInfo from "@/containers/ProductInfo/ProductInfo";
import axiosClient from "@/services/backend/axiosClient";
import { Product } from "@/types/Product";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { getCampaignTime } from "@/utils/date";
import { getCampaignType } from "@/utils/mapper";
import { Carousel } from "@mantine/carousel";
import { Loader } from "@mantine/core";
import { IconBuildingFactory, IconSparkles } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import { useRouter } from "next/router";
import { useState } from "react";

const ProductDetailPage: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ product: rawProduct }) => {
  const router = useRouter();
  const id = router.query.id as string;

  const [saleCampaignId, productCode] = id.split("_");
  const { data, isLoading } = useQuery({
    queryKey: ["product", router.query.id],
    queryFn: async () => {
      const id = router.query.id as string;
      const { data } = await axiosClient.get<CommonResponseBase<Product>>(
        `/marketplace/sale-campaign/${saleCampaignId}/product-in-sale/${productCode}`
      );
      return data;
    },
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ["relatedProducts", rawProduct?.productCode],
    queryFn: async () => {
      const { data: res } = await axiosClient.get<
        CommonResponseBase<PaginationResponseBase<Product>>
      >(
        `/marketplace/product-in-sale?category=${data?.data.category.id}&pageSize=6`
      );

      return res;
    },
  });

  const { data: campaignProducts } = useQuery({
    queryKey: ["campaignProducts", rawProduct?.productCode],
    queryFn: async () => {
      const { data: res } = await axiosClient.get<
        CommonResponseBase<PaginationResponseBase<Product>>
      >(
        `/marketplace/sale-campaign/${saleCampaignId}/product-in-sale?pageSize=6`
      );

      return res;
    },
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [campaignType, setCampaignType] = useState<
    keyof typeof CAMPAIGN_TYPE_DATA
  >(getCampaignType(rawProduct!.saleCampaign));

  if (router.isFallback || isLoading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader />
      </div>
    );

  const product = data?.data;
  if (!product)
    return <NotFoundComponent title={"Không tìm thấy sản phẩm này"} />;
  const { description, attaches, owner, saleCampaign: campaign } = product;

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
            <div className="min-w-[100px]">{campaignTypeData.title} </div>
            {campaignTime && (
              <Timer
                key={campaignType}
                initValue={campaignTime}
                onCompleted={() => setCampaignType(getCampaignType(campaign))}
              />
            )}
          </div>
        </div>
        <div className="relative">
          <ImageWithFallback
            src={campaign.thumbnailUrl}
            alt="img"
            className="!h-[100px] !w-full object-cover brightness-75"
            width={100}
            height={100}
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
            {
              <Carousel.Slide key={"thumbanil"}>
                <div className="flex h-[250px] sm:h-[460px] bg-white">
                  <div className="w-full h-full relative">
                    <ImageWithFallback
                      src={attaches.find((el) => el.type === "THUMBNAIL")?.url}
                      className="object-contain w-full h-full"
                      alt={"thumbail"}
                    />
                  </div>
                </div>
              </Carousel.Slide>
            }
            {attaches
              .filter((el) => el.type !== "THUMBNAIL")
              .map((image) => (
                <Carousel.Slide key={image.id}>
                  <div className="flex h-[250px] sm:h-[460px] bg-white">
                    <div className="w-full h-full relative">
                      <ImageWithFallback
                        src={image.url}
                        className="object-contain w-full h-full"
                        alt={image.title}
                      />
                    </div>
                  </div>
                </Carousel.Slide>
              ))}
          </Carousel>
          <ProductInfo
            key={product.productCode}
            product={product}
            special={product.quantity > 0 ? `` : "Đã hết hàng!"}
          />
          <Description product={product} description={description} />
          <div className="col-span-12 md:col-span-5">
            <ShopCard artist={owner as any} />
            <div className="mt-6 hidden md:block">
              <div className="flex flex-col w-full justify-between gap-x-4 gap-y-3">
                <div className="flex flex-1 gap-x-4 bg-white  shadow py-4 px-6 rounded-md">
                  <div className="bg-primary w-fit h-fit p-3 rounded-xl">
                    <IconSparkles size={36} color="white" />
                  </div>
                  <div>
                    <div className="text-xl font-semibold">
                      Thuộc loại chiến dịch: {product.saleCampaign.type}
                    </div>
                    {product.saleCampaign.type === "PRIVATE"
                      ? `Chiến dịch độc quyền chỉ bán duy nhất tại hệ thống Marketplace của Arty!`
                      : product.saleCampaign.type === "PUBLIC"
                      ? "Chiến dịch độc quyền chỉ bán duy nhất tại Shop riêng của Artist!"
                      : "Dễ dàng mua sắm nhanh chóng ở mọi nơi trong nền tảng của Arty!"}
                  </div>
                </div>
                <div className="flex flex-1 gap-x-4 bg-white  shadow py-4 px-6 rounded-md">
                  <div className="bg-primary w-fit h-fit p-3 rounded-xl">
                    <IconBuildingFactory size={36} color="white" />
                  </div>
                  <div>
                    <div className="text-xl font-semibold">
                      Chất lượng sản phẩm
                    </div>
                    Chất lượng sản phẩm được đảm bảo bởi Arty và các bên cung
                    cấp.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <h2 className="font-bold text-lg mt-10">
          Sản phẩm khác trong chiến dịch:
        </h2>
        <div className="interest-wrapper grid grid-cols-4 md:grid-cols-10 gap-5 mt-5">
          {campaignProducts?.data?.items?.length ? (
            campaignProducts?.data?.items
              ?.filter((item) => item.productCode !== product.productCode)
              ?.map((product, index) => (
                <ProductPreviewCard
                  className="col-span-2"
                  key={product.productCode}
                  data={product}
                />
              ))
          ) : (
            <NotFoundComponent
              title={notfoundMessages.NOT_FOUND_PRODUCTS}
              classNames={{
                root: "col-span-full",
              }}
            />
          )}
        </div>
        <h2 className="font-bold text-lg mt-10">Sản phẩm liên quan:</h2>
        <div className="interest-wrapper grid grid-cols-4 md:grid-cols-10 gap-5 mt-5">
          {relatedProducts?.data?.items?.length ? (
            relatedProducts?.data?.items
              ?.filter((item) => item.productCode !== product.productCode)
              ?.map((product, index) => (
                <ProductPreviewCard
                  className="col-span-2"
                  key={product.productCode}
                  data={product}
                />
              ))
          ) : (
            <NotFoundComponent
              title={notfoundMessages.NOT_FOUND_PRODUCTS}
              classNames={{
                root: "col-span-full",
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const { params } = context;
  if (!params?.id || typeof params.id !== "string") return { props: {} };
  const { data } = await axiosClient.get<CommonResponseBase<Product>>(
    `/marketplace/sale-campaign/${params.id?.split("_")[0]}/product-in-sale/${
      params.id?.split("_")[1]
    }`
  );

  return {
    props: {
      product: data.data,
    },
    revalidate: 2,
  };
};

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};

export default ProductDetailPage;
