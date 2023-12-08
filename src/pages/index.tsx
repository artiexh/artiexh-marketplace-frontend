import ArtistPreviewCard from "@/components/ArtistPreviewCard/ArtistPreviewCard";
import CampaignPreviewCard from "@/components/CampaignPreviewCard/CampaignPreviewCard";
import ProductPreviewCard from "@/components/Cards/ProductCard/ProductPreviewCard";
import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import { ROUTE } from "@/constants/route";
import axiosClient from "@/services/backend/axiosClient";
import productStyles from "@/styles/Products/ProductList.module.scss";
import { CampaignData } from "@/types/Campaign";
import { Product } from "@/types/Product";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { Artist } from "@/types/User";
import { Carousel } from "@mantine/carousel";
import clsx from "clsx";
import { GetStaticPropsContext, InferGetStaticPropsType, NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import useSWR from "swr";

const TAG_COLORS = [
  "#FF9898",
  "#FFB571",
  "#9CA6FF",
  "#57AC3C",
  "#FF8179",
  "#FFB571",
  "#9CA6FF",
];

const HomePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  campaigns,
}) => {
  const { data: products, isLoading } = useSWR(
    ["/marketplace/product-in-sale?pageSize=6"],
    (key) =>
      axiosClient
        .get<CommonResponseBase<{ items: Product[] }>>(key[0])
        .then((res) => res.data.data)
  );
  const { data: artists, isLoading: isArtistLoading } = useSWR(
    ["/marketplace/artist?pageSize=6"],
    (key) =>
      axiosClient
        .get<CommonResponseBase<{ items: Artist[] }>>(key[0])
        .then((res) => res.data.data)
  );

  const router = useRouter();

  return (
    <div className="home-page flex flex-col gap-[100px]">
      <Carousel
        h={400}
        withControls={false}
        withIndicators
        classNames={{
          root: "w-full lg:rounded-md",
          viewport: "h-full lg:rounded-md",
          container: "h-full lg:rounded-md",
          slide: "h-full",
          indicator: "bg-white",
        }}
      >
        {campaigns.map((element) => (
          <Carousel.Slide key={element.id}>
            <div className="relative h-full">
              <ImageWithFallback
                src={element.thumbnailUrl}
                // src="https://images.augustman.com/wp-content/uploads/sites/2/2023/04/26131013/dragon-bll.jpeg"
                className="object-cover brightness-50"
                alt={element.id}
              />
              <div className="absolute bottom-0 text-white opacity-80 w-full pl-10 py-10">
                <div className="text-[24px] font-bold">{element.name}</div>
                <div className="text-sm mb-4">{element.description}</div>
                <div
                  className="font-bold text-sm cursor-pointer"
                  onClick={() => router.push(`/campaigns/${element.id}`)}
                >
                  VIEW CAMPAIGN
                </div>
              </div>
            </div>
          </Carousel.Slide>
        ))}
      </Carousel>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="font-bold text-xl">Campaign đang hot</div>
          <div
            className="text-sm cursor-pointer"
            onClick={() => {
              router.push("/campaigns");
            }}
          >
            Xem tất cả
          </div>
        </div>
        <div className={clsx("mt-3 hidden md:grid md:grid-cols-2 gap-8 ")}>
          {campaigns?.map((campaign, index) => (
            <CampaignPreviewCard campaign={campaign} key={index} />
          ))}
        </div>
        <div
          className={clsx("mt-3 grid md:hidden !grid-cols-1 gap-8 !md:hidden")}
        >
          {campaigns
            ?.filter((item, idx) => idx <= 1)
            .map((campaign, index) => (
              <CampaignPreviewCard campaign={campaign} key={index} />
            ))}
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="font-bold text-xl">Những sản phẩm mới nổi</div>
          <div
            className="font-semibold hidden lg:block cursor-pointer"
            onClick={() => router.push(ROUTE.PRODUCT_LIST)}
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
          {products?.items.map((product, index) => (
            <ProductPreviewCard data={product} key={index} />
          ))}
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="font-bold text-xl">Artist của Arty</div>
          <div
            className="font-semibold hidden lg:block cursor-pointer"
            onClick={() => router.push("/shop")}
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
          {artists?.items.map((artist, index) => (
            <ArtistPreviewCard artist={artist} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  let campaigns: CampaignData[] = [];
  try {
    const { data: campaignRes } = await axiosClient.get<
      CommonResponseBase<PaginationResponseBase<CampaignData>>
    >("/marketplace/sale-campaign?pageSize=4&sortBy=id&sortOrder=DESC");

    campaigns = campaignRes.data.items;
  } catch (e) {
    console.error(e);
  }
  return {
    props: {
      campaigns,
    },
    revalidate: 10,
  };
};

export default HomePage;
