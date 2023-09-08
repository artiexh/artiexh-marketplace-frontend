import ProductPreviewCard from "@/components/Cards/ProductCard/ProductPreviewCard";
import axiosClient from "@/services/backend/axiosClient";
import { Category, Product, Tag } from "@/types/Product";
import { GetStaticPropsContext, InferGetStaticPropsType, NextPage } from "next";
import productStyles from "@/styles/products/ProductList.module.scss";
import clsx from "clsx";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import useSWR from "swr";
import HeroSection from "@/components/Home/HeroSection";
import { HomeBranding } from "@/types/HomeBranding";
import PreviewList from "@/components/PreviewList";
import ssrAxiosClient from "@/services/backend/axiosMockups/ssrAxiosMockupClient";
import { useRouter } from "next/router";
import { ROUTE } from "@/constants/route";
import Image from "next/image";

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
  hotProducts,
  hotTags,
  homeBranding,
  categories,
}) => {
  const { data: products, isLoading } = useSWR(["/product"], (key) =>
    axiosClient
      .get<CommonResponseBase<{ items: Product[] }>>(key[0])
      .then((res) => res.data.data)
  );

  const router = useRouter();

  return (
    <div className="home-page flex flex-col gap-8 lg:gap-16">
      <HeroSection
        promotionElements={homeBranding?.promotions ?? []}
        carouselElements={homeBranding?.campaigns ?? []}
        className="flex h-[12rem] lg:h-[27rem] gap-4 w-[100vw] lg:w-full -ml-6 md:mx-auto"
      />
      <div>
        <div>Trending tags:</div>
        <PreviewList
          data={hotTags}
          classNames={{
            root: "mt-3",
            slide: "flex-none",
            controls: "hidden lg:flex",
          }}
          render={(tag) => (
            <div
              key={tag.name}
              className="text-center text-white h-12 w-32 lg:h-20 lg:w-[11.5rem] flex flex-col items-center justify-center"
              style={{ backgroundColor: tag.color }}
            >
              <div className="font-bold">{tag.name}</div>
            </div>
          )}
        />
      </div>
      <div>
        <div className="flex justify-between">
          <div className="flex text-center font-semibold">
            <div className="w-[7rem] sm:w-[12.5rem] bg-white rounded-xl p-1">
              Hot
            </div>
            <div className="w-[7rem] sm:w-[12.5rem] text-[#AFAFAF] p-1">
              For me
            </div>
          </div>
          <div
            className="font-semibold hidden lg:block cursor-pointer"
            onClick={() => router.push(ROUTE.PRODUCT_LIST)}
          >
            Xem tất cả
          </div>
        </div>
        <PreviewList
          data={hotProducts}
          classNames={{
            root: "mt-5",
            container: "gap-x-4 xl:gap-x-6",
            slide:
              "w-[calc((100vw-(1.0895rem*2)-(1.5rem*2))/2)] sm:w-[calc((100vw-(1.0585rem*3)-(1.5rem*2))/3)] md:w-[calc((100vw-(1.0435rem*4)-(1.5rem*2))/4)] flex-none lg:flex-1",
            controls: "hidden lg:flex",
          }}
          render={(product: Product) => (
            <ProductPreviewCard data={product} key={product.name} />
          )}
        />
      </div>
      <div className="hidden lg:block">
        <div className="border p-6 font-semibold">DANH MỤC</div>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
          {[
            categories.map((category, index) => (
              <div
                key={index}
                className="flex flex-col items-center flex-1 border p-4"
              >
                <div>
                  <Image
                    className="rounded-full aspect-square"
                    src={category.imageUrl}
                    alt="category-image"
                    width={100}
                    height={100}
                  />
                </div>
                <div className="mt-3 text-center">{category.name}</div>
              </div>
            )),
          ]}
        </div>
      </div>
      <div>
        <div className="font-semibold">Gợi ý cho bạn hôm nay</div>
        <div
          className={clsx(
            productStyles["product-list-grid"],
            "mt-3 lg:!grid-cols-5"
          )}
        >
          {products?.items.map((product, index) => (
            <ProductPreviewCard data={product} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  let hotProducts: Product[] = [];
  let hotTags: Tag[] = [];
  let homeBranding: HomeBranding | null = null;
  let categories: Category[] = [];
  try {
    const [
      { data: productRes },
      { data: hotTagsRes },
      { data: homeBrandingRes },
      { data: categoryRes },
    ] = await Promise.all([
      axiosClient.get<CommonResponseBase<PaginationResponseBase<Product>>>(
        "/product?pageSize=5"
      ),
      axiosClient.get<CommonResponseBase<PaginationResponseBase<Tag>>>(
        "/tag?pageSize=12"
      ),
      ssrAxiosClient.get<CommonResponseBase<HomeBranding>>(
        "/homepage_branding"
      ),
      axiosClient.get<CommonResponseBase<PaginationResponseBase<Category>>>(
        "/category?pageSize=8"
      ),
    ]);
    hotProducts = productRes.data.items;
    hotTags = hotTagsRes.data.items;
    homeBranding = homeBrandingRes.data;
    categories = categoryRes.data.items;
  } catch (e) {
    console.error(e);
  }

  return {
    props: {
      hotProducts,
      hotTags: hotTags.map((tag, idx) => {
        return {
          ...tag,
          color: TAG_COLORS[idx % TAG_COLORS.length],
        };
      }),
      homeBranding,
      categories,
    },
    revalidate: 10,
  };
};

export default HomePage;
