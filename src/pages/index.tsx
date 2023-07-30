import ProductPreviewCard from "@/components/Cards/ProductCard/ProductPreviewCard";
import Layout from "@/layouts/Layout/Layout";
import ssrAxiosClient from "@/services/backend/axiosMockups/ssrAxiosMockupClient";
import { Product, Tag } from "@/types/Product";
import { GetStaticPropsContext, InferGetStaticPropsType, NextPage } from "next";
import productStyles from "@/styles/Products/productList.module.scss";
import clsx from "clsx";
import { CommonResponseBase } from "@/types/ResponseBase";
import useSWR from "swr";
// import axiosClient from "@/services/backend/axiosMockups/axiosMockupClient";
import axiosClient from "@/services/backend/haiEndpointCC";
import HeroSection from "@/components/Home/HeroSection";
import { HomeBranding } from "@/types/HomeBranding";
import PreviewList from "@/components/PreviewList";

const HomePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  hotProducts,
  hotTags,
  homeBranding,
}) => {
  const { data: products, isLoading } = useSWR(["/product"], (key) => ({
    data: [
      {
        id: "1",
        name: "Lycoris keychain - Chisato",
        price: {
          value: 10000000,
          unit: "VND",
        },
        cost: 1,
        categoryId: 7,
        publishDatetime: "12/10/2023",
        description: "This is product 1, it is very good",
        tags: ["tag1", "tag2", "tag3"],
        ownerInfo: {
          id: 1,
          displayName: "MeowMeow shop",
          rating: 4.5,
          username: "meowmeow",
        },
        attaches: [
          {
            id: "1",
            url: "https://picsum.photos/300/300",
            type: "IMAGE",
            title: "This is image 1",
            description: "This is image 1",
          },
          {
            id: "2",
            url: "https://picsum.photos/300/300",
            type: "IMAGE",
            title: "This is image 2",
            description: "This is image 2",
          },
          {
            id: "3",
            url: "https://picsum.photos/300/300",
            type: "IMAGE",
            title: "This is image 3",
            description: "This is image 3",
          },
        ],
        ratings: 1,
        status: "AVAILABLE",
        type: "NORMAL",
        remainingQuantity: 100,
        maxItemsPerOrder: 10,
        allowDelivery: true,
        paymentMethods: [
          {
            id: "1",
            type: "COD",
          },
          {
            id: "2",
            type: "ONLINE",
          },
        ],
        category: {
          id: "7",
          name: "Category 7",
        },
        memberOnly: false,
      },
      {
        id: "2",
        name: "Lycoris keychain - Chisato",
        price: {
          value: 10000000,
          unit: "VND",
        },
        cost: 2,
        categoryId: 6,
        publishDatetime: "12/10/2023",
        description: "This is product 1, it is very good",
        tags: ["tag1", "tag2", "tag3"],
        ownerInfo: {
          id: 1,
          displayName: "MeowMeow shop",
          rating: 4.5,
          username: "meowmeow",
        },
        attaches: [
          {
            id: "1",
            url: "https://picsum.photos/300/300",
            type: "IMAGE",
            title: "This is image 1",
            description: "This is image 1",
          },
          {
            id: "2",
            url: "https://picsum.photos/300/300",
            type: "IMAGE",
            title: "This is image 2",
            description: "This is image 2",
          },
          {
            id: "3",
            url: "https://picsum.photos/300/300",
            type: "IMAGE",
            title: "This is image 3",
            description: "This is image 3",
          },
        ],
        ratings: 5,
        status: "AVAILABLE",
        type: "NORMAL",
        remainingQuantity: 100,
        maxItemsPerOrder: 10,
        allowDelivery: true,
        paymentMethods: [
          {
            id: "1",
            type: "COD",
          },
          {
            id: "2",
            type: "ONLINE",
          },
        ],
        category: {
          id: "6",
          name: "Category 6",
        },
        memberOnly: false,
      },
      {
        id: "3",
        name: "Lycoris keychain - Chisato",
        price: {
          value: 10000000,
          unit: "VND",
        },
        cost: 3,
        categoryId: 6,
        publishDatetime: "12/10/2023",
        description: "This is product 1, it is very good",
        tags: ["tag1", "tag2", "tag3"],
        ownerInfo: {
          id: 1,
          displayName: "MeowMeow shop",
          rating: 4.5,
          username: "meowmeow",
        },
        attaches: [
          {
            id: "1",
            url: "https://picsum.photos/300/300",
            type: "IMAGE",
            title: "This is image 1",
            description: "This is image 1",
          },
          {
            id: "2",
            url: "https://picsum.photos/300/300",
            type: "IMAGE",
            title: "This is image 2",
            description: "This is image 2",
          },
          {
            id: "3",
            url: "https://picsum.photos/300/300",
            type: "IMAGE",
            title: "This is image 3",
            description: "This is image 3",
          },
        ],
        ratings: 5,
        status: "AVAILABLE",
        type: "NORMAL",
        remainingQuantity: 100,
        maxItemsPerOrder: 10,
        allowDelivery: true,
        paymentMethods: [
          {
            id: "1",
            type: "COD",
          },
          {
            id: "2",
            type: "ONLINE",
          },
        ],
        category: {
          id: "6",
          name: "Category 6",
        },
        memberOnly: false,
      },
      {
        id: "4",
        name: "Lycoris keychain - Chisato",
        price: {
          value: 10000000,
          unit: "VND",
        },
        cost: 4,
        categoryId: 3,
        publishDatetime: "12/10/2023",
        description: "This is product 1, it is very good",
        tags: ["tag1", "tag2", "tag3"],
        ownerInfo: {
          id: 1,
          displayName: "MeowMeow shop",
          rating: 4.5,
          username: "meowmeow",
        },
        attaches: [
          {
            id: "1",
            url: "https://picsum.photos/300/300",
            type: "IMAGE",
            title: "This is image 1",
            description: "This is image 1",
          },
          {
            id: "2",
            url: "https://picsum.photos/300/300",
            type: "IMAGE",
            title: "This is image 2",
            description: "This is image 2",
          },
          {
            id: "3",
            url: "https://picsum.photos/300/300",
            type: "IMAGE",
            title: "This is image 3",
            description: "This is image 3",
          },
        ],
        ratings: 5,
        status: "AVAILABLE",
        type: "NORMAL",
        remainingQuantity: 100,
        maxItemsPerOrder: 10,
        allowDelivery: true,
        paymentMethods: [
          {
            id: "1",
            type: "COD",
          },
          {
            id: "2",
            type: "ONLINE",
          },
        ],
        category: {
          id: "3",
          name: "Category 3",
        },
        memberOnly: false,
      },
      {
        id: "5",
        name: "Lycoris keychain - Chisato",
        price: {
          value: 10000000,
          unit: "VND",
        },
        cost: 5,
        categoryId: 2,
        publishDatetime: "12/10/2023",
        description: "This is product 1, it is very good",
        tags: ["tag1", "tag2", "tag3"],
        ownerInfo: {
          id: 1,
          displayName: "MeowMeow shop",
          rating: 4.5,
          username: "meowmeow",
        },
        attaches: [
          {
            id: "1",
            url: "https://picsum.photos/300/300",
            type: "IMAGE",
            title: "This is image 1",
            description: "This is image 1",
          },
          {
            id: "2",
            url: "https://picsum.photos/300/300",
            type: "IMAGE",
            title: "This is image 2",
            description: "This is image 2",
          },
          {
            id: "3",
            url: "https://picsum.photos/300/300",
            type: "IMAGE",
            title: "This is image 3",
            description: "This is image 3",
          },
        ],
        ratings: 5,
        status: "AVAILABLE",
        type: "NORMAL",
        remainingQuantity: 100,
        maxItemsPerOrder: 10,
        allowDelivery: true,
        paymentMethods: [
          {
            id: "1",
            type: "COD",
          },
          {
            id: "2",
            type: "ONLINE",
          },
        ],
        category: {
          id: "2",
          name: "Category 2",
        },
        memberOnly: false,
      },
      {
        id: "6",
        name: "Lycoris keychain - Chisato",
        price: {
          value: 10000000,
          unit: "VND",
        },
        cost: 6,
        categoryId: 2,
        publishDatetime: "12/10/2023",
        description: "This is product 1, it is very good",
        tags: ["tag1", "tag2", "tag3"],
        ownerInfo: {
          id: 1,
          displayName: "MeowMeow shop",
          rating: 4.5,
        },
        attaches: [
          {
            id: "1",
            url: "https://picsum.photos/300/300",
            type: "IMAGE",
            title: "This is image 1",
            description: "This is image 1",
          },
          {
            id: "2",
            url: "https://picsum.photos/300/300",
            type: "IMAGE",
            title: "This is image 2",
            description: "This is image 2",
          },
          {
            id: "3",
            url: "https://picsum.photos/300/300",
            type: "IMAGE",
            title: "This is image 3",
            description: "This is image 3",
          },
        ],
        ratings: 5,
        status: "AVAILABLE",
        type: "NORMAL",
        remainingQuantity: 100,
        maxItemsPerOrder: 10,
        allowDelivery: true,
        paymentMethods: [
          {
            id: "1",
            type: "COD",
          },
          {
            id: "2",
            type: "ONLINE",
          },
        ],
        category: {
          id: "2",
          name: "Category 2",
        },
        memberOnly: false,
      },
      {
        id: "7",
        name: "Lycoris keychain - Chisato",
        price: {
          value: 10000000,
          unit: "VND",
        },
        cost: 7,
        categoryId: 1,
        publishDatetime: "12/10/2023",
        description: "This is product 1, it is very good",
        tags: ["tag1", "tag2", "tag3"],
        ownerInfo: {
          id: 1,
          displayName: "MeowMeow shop",
          rating: 4.5,
        },
        attaches: [
          {
            id: "1",
            url: "https://picsum.photos/300/300",
            type: "IMAGE",
            title: "This is image 1",
            description: "This is image 1",
          },
          {
            id: "2",
            url: "https://picsum.photos/300/300",
            type: "IMAGE",
            title: "This is image 2",
            description: "This is image 2",
          },
          {
            id: "3",
            url: "https://picsum.photos/300/300",
            type: "IMAGE",
            title: "This is image 3",
            description: "This is image 3",
          },
        ],
        ratings: 5,
        status: "AVAILABLE",
        type: "NORMAL",
        remainingQuantity: 100,
        maxItemsPerOrder: 10,
        allowDelivery: true,
        paymentMethods: [
          {
            id: "1",
            type: "COD",
          },
          {
            id: "2",
            type: "ONLINE",
          },
        ],
        category: {
          id: "1",
          name: "Category 1",
        },
        memberOnly: false,
      },
      {
        id: "8",
        name: "Lycoris keychain - Chisato",
        price: {
          value: 10000000,
          unit: "VND",
        },
        cost: 10,
        categoryId: 1,
        publishDatetime: "12/10/2023",
        description: "This is product 1, it is very good",
        tags: ["tag1", "tag2", "tag3"],
        ownerInfo: {
          id: 1,
          displayName: "MeowMeow shop",
          rating: 4.5,
        },
        attaches: [
          {
            id: "1",
            url: "https://picsum.photos/300/300",
            type: "IMAGE",
            title: "This is image 1",
            description: "This is image 1",
          },
          {
            id: "2",
            url: "https://picsum.photos/300/300",
            type: "IMAGE",
            title: "This is image 2",
            description: "This is image 2",
          },
          {
            id: "3",
            url: "https://picsum.photos/300/300",
            type: "IMAGE",
            title: "This is image 3",
            description: "This is image 3",
          },
        ],
        ratings: 5,
        status: "AVAILABLE",
        type: "NORMAL",
        remainingQuantity: 100,
        maxItemsPerOrder: 10,
        allowDelivery: true,
        paymentMethods: [
          {
            id: "1",
            type: "COD",
          },
          {
            id: "2",
            type: "ONLINE",
          },
        ],
        category: {
          id: "1",
          name: "Category 1",
        },
        memberOnly: false,
      },
      {
        id: "9",
        name: "Lycoris keychain - Chisato",
        price: {
          value: 10000000,
          unit: "VND",
        },
        cost: 8,
        categoryId: 2,
        publishDatetime: "12/10/2023",
        description: "This is product 1, it is very good",
        tags: ["tag1", "tag2", "tag3"],
        ownerInfo: {
          id: 1,
          displayName: "MeowMeow shop",
          rating: 4.5,
        },
        attaches: [
          {
            id: "1",
            url: "https://picsum.photos/300/300",
            type: "IMAGE",
            title: "This is image 1",
            description: "This is image 1",
          },
          {
            id: "2",
            url: "https://picsum.photos/300/300",
            type: "IMAGE",
            title: "This is image 2",
            description: "This is image 2",
          },
          {
            id: "3",
            url: "https://picsum.photos/300/300",
            type: "IMAGE",
            title: "This is image 3",
            description: "This is image 3",
          },
        ],
        ratings: 5,
        status: "AVAILABLE",
        type: "NORMAL",
        remainingQuantity: 100,
        maxItemsPerOrder: 10,
        allowDelivery: true,
        paymentMethods: [
          {
            id: "1",
            type: "COD",
          },
          {
            id: "2",
            type: "ONLINE",
          },
        ],
        category: {
          id: "2",
          name: "Category 2",
        },
        memberOnly: false,
      },
      {
        id: "10",
        name: "Lycoris keychain - Chisato",
        price: {
          value: 10000000,
          unit: "VND",
        },
        cost: 9,
        categoryId: 1,
        publishDatetime: "12/10/2023",
        description: "This is product 1, it is very good",
        tags: ["tag1", "tag2", "tag3"],
        ownerInfo: {
          id: 1,
          displayName: "MeowMeow shop",
          rating: 4.5,
        },
        attaches: [
          {
            id: "1",
            url: "https://picsum.photos/300/300",
            type: "IMAGE",
            title: "This is image 1",
            description: "This is image 1",
          },
          {
            id: "2",
            url: "https://picsum.photos/300/300",
            type: "IMAGE",
            title: "This is image 2",
            description: "This is image 2",
          },
          {
            id: "3",
            url: "https://picsum.photos/300/300",
            type: "IMAGE",
            title: "This is image 3",
            description: "This is image 3",
          },
        ],
        ratings: 5,
        status: "AVAILABLE",
        type: "NORMAL",
        remainingQuantity: 100,
        maxItemsPerOrder: 10,
        allowDelivery: true,
        paymentMethods: [
          {
            id: "1",
            type: "COD",
          },
          {
            id: "2",
            type: "ONLINE",
          },
        ],
        category: {
          id: "1",
          name: "Category 1",
        },
        memberOnly: false,
      },
    ],
    tags: [
      {
        name: "#hsr",
        description: "5050 products",
        type: "HOT",
        color: "#FF9898",
      },
      {
        name: "#hsr",
        description: "5050 products",
        type: "HOT",
        color: "#FFB571",
      },
      {
        name: "#hsr",
        description: "5050 products",
        type: "HOT",
        color: "#9CA6FF",
      },
      {
        name: "#hsr",
        description: "5050 products",
        type: "HOT",
        color: "#57AC3C",
      },
      {
        name: "#hsr",
        description: "5050 products",
        type: "HOT",
        color: "#FF8179",
      },
      {
        name: "#hsr",
        description: "5050 products",
        type: "HOT",
        color: "#FFB571",
      },
      {
        name: "#hsr",
        description: "5050 products",
        type: "HOT",
        color: "#9CA6FF",
      },
    ],
  }));

  console.log(products);

  return (
    <Layout>
      <div className="flex flex-col gap-8 lg:gap-16">
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
            render={(product: Tag) => (
              <div
                key={product.name}
                className="text-center text-white h-12 w-32 lg:h-20 lg:w-[11.5rem] flex flex-col items-center justify-center"
                style={{ backgroundColor: product.color }}
              >
                <div className="font-bold">{product.name}</div>
                <div className="text-xs">{product.description}</div>
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
            <div className="font-semibold hidden lg:block">Xem tất cả</div>
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
              [...Array(8)].map((category, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center flex-1 border p-4"
                >
                  <div className="bg-[#D9D9D9] rounded-full w-24 h-24" />
                  <div className="mt-3 text-center">Category name</div>
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
            {products?.data?.map((product, index) => (
              //@ts-ignore
              <ProductPreviewCard data={product} key={index} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  let hotProducts: Product[] = [];
  let hotTags: Tag[] = [];
  let homeBranding: HomeBranding | null = null;
  try {
    const [productRes, hotTagsRes, homeBrandingRes] =
      // ] = await Promise.all([
      //   ssrAxiosClient.get<CommonResponseBase<Product[]>>("/products?_limit=5"),
      //   ssrAxiosClient.get<CommonResponseBase<Tag[]>>("/tags?type=HOT"),
      //   ssrAxiosClient.get<CommonResponseBase<HomeBranding>>(
      //     "/homepage_branding"
      //   ),
      // ]);
      [
        {
          data: [
            {
              id: "1",
              name: "Lycoris keychain - Chisato",
              price: {
                value: 10000000,
                unit: "VND",
              },
              cost: 1,
              categoryId: 7,
              publishDatetime: "12/10/2023",
              description: "This is product 1, it is very good",
              tags: ["tag1", "tag2", "tag3"],
              ownerInfo: {
                id: 1,
                displayName: "MeowMeow shop",
                rating: 4.5,
                username: "meowmeow",
              },
              attaches: [
                {
                  id: "1",
                  url: "https://picsum.photos/300/300",
                  type: "IMAGE",
                  title: "This is image 1",
                  description: "This is image 1",
                },
                {
                  id: "2",
                  url: "https://picsum.photos/300/300",
                  type: "IMAGE",
                  title: "This is image 2",
                  description: "This is image 2",
                },
                {
                  id: "3",
                  url: "https://picsum.photos/300/300",
                  type: "IMAGE",
                  title: "This is image 3",
                  description: "This is image 3",
                },
              ],
              ratings: 1,
              status: "AVAILABLE",
              type: "NORMAL",
              remainingQuantity: 100,
              maxItemsPerOrder: 10,
              allowDelivery: true,
              paymentMethods: [
                {
                  id: "1",
                  type: "COD",
                },
                {
                  id: "2",
                  type: "ONLINE",
                },
              ],
              category: {
                id: "7",
                name: "Category 7",
              },
              memberOnly: false,
            },
            {
              id: "2",
              name: "Lycoris keychain - Chisato",
              price: {
                value: 10000000,
                unit: "VND",
              },
              cost: 2,
              categoryId: 6,
              publishDatetime: "12/10/2023",
              description: "This is product 1, it is very good",
              tags: ["tag1", "tag2", "tag3"],
              ownerInfo: {
                id: 1,
                displayName: "MeowMeow shop",
                rating: 4.5,
                username: "meowmeow",
              },
              attaches: [
                {
                  id: "1",
                  url: "https://picsum.photos/300/300",
                  type: "IMAGE",
                  title: "This is image 1",
                  description: "This is image 1",
                },
                {
                  id: "2",
                  url: "https://picsum.photos/300/300",
                  type: "IMAGE",
                  title: "This is image 2",
                  description: "This is image 2",
                },
                {
                  id: "3",
                  url: "https://picsum.photos/300/300",
                  type: "IMAGE",
                  title: "This is image 3",
                  description: "This is image 3",
                },
              ],
              ratings: 5,
              status: "AVAILABLE",
              type: "NORMAL",
              remainingQuantity: 100,
              maxItemsPerOrder: 10,
              allowDelivery: true,
              paymentMethods: [
                {
                  id: "1",
                  type: "COD",
                },
                {
                  id: "2",
                  type: "ONLINE",
                },
              ],
              category: {
                id: "6",
                name: "Category 6",
              },
              memberOnly: false,
            },
            {
              id: "3",
              name: "Lycoris keychain - Chisato",
              price: {
                value: 10000000,
                unit: "VND",
              },
              cost: 3,
              categoryId: 6,
              publishDatetime: "12/10/2023",
              description: "This is product 1, it is very good",
              tags: ["tag1", "tag2", "tag3"],
              ownerInfo: {
                id: 1,
                displayName: "MeowMeow shop",
                rating: 4.5,
                username: "meowmeow",
              },
              attaches: [
                {
                  id: "1",
                  url: "https://picsum.photos/300/300",
                  type: "IMAGE",
                  title: "This is image 1",
                  description: "This is image 1",
                },
                {
                  id: "2",
                  url: "https://picsum.photos/300/300",
                  type: "IMAGE",
                  title: "This is image 2",
                  description: "This is image 2",
                },
                {
                  id: "3",
                  url: "https://picsum.photos/300/300",
                  type: "IMAGE",
                  title: "This is image 3",
                  description: "This is image 3",
                },
              ],
              ratings: 5,
              status: "AVAILABLE",
              type: "NORMAL",
              remainingQuantity: 100,
              maxItemsPerOrder: 10,
              allowDelivery: true,
              paymentMethods: [
                {
                  id: "1",
                  type: "COD",
                },
                {
                  id: "2",
                  type: "ONLINE",
                },
              ],
              category: {
                id: "6",
                name: "Category 6",
              },
              memberOnly: false,
            },
            {
              id: "4",
              name: "Lycoris keychain - Chisato",
              price: {
                value: 10000000,
                unit: "VND",
              },
              cost: 4,
              categoryId: 3,
              publishDatetime: "12/10/2023",
              description: "This is product 1, it is very good",
              tags: ["tag1", "tag2", "tag3"],
              ownerInfo: {
                id: 1,
                displayName: "MeowMeow shop",
                rating: 4.5,
                username: "meowmeow",
              },
              attaches: [
                {
                  id: "1",
                  url: "https://picsum.photos/300/300",
                  type: "IMAGE",
                  title: "This is image 1",
                  description: "This is image 1",
                },
                {
                  id: "2",
                  url: "https://picsum.photos/300/300",
                  type: "IMAGE",
                  title: "This is image 2",
                  description: "This is image 2",
                },
                {
                  id: "3",
                  url: "https://picsum.photos/300/300",
                  type: "IMAGE",
                  title: "This is image 3",
                  description: "This is image 3",
                },
              ],
              ratings: 5,
              status: "AVAILABLE",
              type: "NORMAL",
              remainingQuantity: 100,
              maxItemsPerOrder: 10,
              allowDelivery: true,
              paymentMethods: [
                {
                  id: "1",
                  type: "COD",
                },
                {
                  id: "2",
                  type: "ONLINE",
                },
              ],
              category: {
                id: "3",
                name: "Category 3",
              },
              memberOnly: false,
            },
            {
              id: "5",
              name: "Lycoris keychain - Chisato",
              price: {
                value: 10000000,
                unit: "VND",
              },
              cost: 5,
              categoryId: 2,
              publishDatetime: "12/10/2023",
              description: "This is product 1, it is very good",
              tags: ["tag1", "tag2", "tag3"],
              ownerInfo: {
                id: 1,
                displayName: "MeowMeow shop",
                rating: 4.5,
                username: "meowmeow",
              },
              attaches: [
                {
                  id: "1",
                  url: "https://picsum.photos/300/300",
                  type: "IMAGE",
                  title: "This is image 1",
                  description: "This is image 1",
                },
                {
                  id: "2",
                  url: "https://picsum.photos/300/300",
                  type: "IMAGE",
                  title: "This is image 2",
                  description: "This is image 2",
                },
                {
                  id: "3",
                  url: "https://picsum.photos/300/300",
                  type: "IMAGE",
                  title: "This is image 3",
                  description: "This is image 3",
                },
              ],
              ratings: 5,
              status: "AVAILABLE",
              type: "NORMAL",
              remainingQuantity: 100,
              maxItemsPerOrder: 10,
              allowDelivery: true,
              paymentMethods: [
                {
                  id: "1",
                  type: "COD",
                },
                {
                  id: "2",
                  type: "ONLINE",
                },
              ],
              category: {
                id: "2",
                name: "Category 2",
              },
              memberOnly: false,
            },
            {
              id: "6",
              name: "Lycoris keychain - Chisato",
              price: {
                value: 10000000,
                unit: "VND",
              },
              cost: 6,
              categoryId: 2,
              publishDatetime: "12/10/2023",
              description: "This is product 1, it is very good",
              tags: ["tag1", "tag2", "tag3"],
              ownerInfo: {
                id: 1,
                displayName: "MeowMeow shop",
                rating: 4.5,
              },
              attaches: [
                {
                  id: "1",
                  url: "https://picsum.photos/300/300",
                  type: "IMAGE",
                  title: "This is image 1",
                  description: "This is image 1",
                },
                {
                  id: "2",
                  url: "https://picsum.photos/300/300",
                  type: "IMAGE",
                  title: "This is image 2",
                  description: "This is image 2",
                },
                {
                  id: "3",
                  url: "https://picsum.photos/300/300",
                  type: "IMAGE",
                  title: "This is image 3",
                  description: "This is image 3",
                },
              ],
              ratings: 5,
              status: "AVAILABLE",
              type: "NORMAL",
              remainingQuantity: 100,
              maxItemsPerOrder: 10,
              allowDelivery: true,
              paymentMethods: [
                {
                  id: "1",
                  type: "COD",
                },
                {
                  id: "2",
                  type: "ONLINE",
                },
              ],
              category: {
                id: "2",
                name: "Category 2",
              },
              memberOnly: false,
            },
            {
              id: "7",
              name: "Lycoris keychain - Chisato",
              price: {
                value: 10000000,
                unit: "VND",
              },
              cost: 7,
              categoryId: 1,
              publishDatetime: "12/10/2023",
              description: "This is product 1, it is very good",
              tags: ["tag1", "tag2", "tag3"],
              ownerInfo: {
                id: 1,
                displayName: "MeowMeow shop",
                rating: 4.5,
              },
              attaches: [
                {
                  id: "1",
                  url: "https://picsum.photos/300/300",
                  type: "IMAGE",
                  title: "This is image 1",
                  description: "This is image 1",
                },
                {
                  id: "2",
                  url: "https://picsum.photos/300/300",
                  type: "IMAGE",
                  title: "This is image 2",
                  description: "This is image 2",
                },
                {
                  id: "3",
                  url: "https://picsum.photos/300/300",
                  type: "IMAGE",
                  title: "This is image 3",
                  description: "This is image 3",
                },
              ],
              ratings: 5,
              status: "AVAILABLE",
              type: "NORMAL",
              remainingQuantity: 100,
              maxItemsPerOrder: 10,
              allowDelivery: true,
              paymentMethods: [
                {
                  id: "1",
                  type: "COD",
                },
                {
                  id: "2",
                  type: "ONLINE",
                },
              ],
              category: {
                id: "1",
                name: "Category 1",
              },
              memberOnly: false,
            },
            {
              id: "8",
              name: "Lycoris keychain - Chisato",
              price: {
                value: 10000000,
                unit: "VND",
              },
              cost: 10,
              categoryId: 1,
              publishDatetime: "12/10/2023",
              description: "This is product 1, it is very good",
              tags: ["tag1", "tag2", "tag3"],
              ownerInfo: {
                id: 1,
                displayName: "MeowMeow shop",
                rating: 4.5,
              },
              attaches: [
                {
                  id: "1",
                  url: "https://picsum.photos/300/300",
                  type: "IMAGE",
                  title: "This is image 1",
                  description: "This is image 1",
                },
                {
                  id: "2",
                  url: "https://picsum.photos/300/300",
                  type: "IMAGE",
                  title: "This is image 2",
                  description: "This is image 2",
                },
                {
                  id: "3",
                  url: "https://picsum.photos/300/300",
                  type: "IMAGE",
                  title: "This is image 3",
                  description: "This is image 3",
                },
              ],
              ratings: 5,
              status: "AVAILABLE",
              type: "NORMAL",
              remainingQuantity: 100,
              maxItemsPerOrder: 10,
              allowDelivery: true,
              paymentMethods: [
                {
                  id: "1",
                  type: "COD",
                },
                {
                  id: "2",
                  type: "ONLINE",
                },
              ],
              category: {
                id: "1",
                name: "Category 1",
              },
              memberOnly: false,
            },
            {
              id: "9",
              name: "Lycoris keychain - Chisato",
              price: {
                value: 10000000,
                unit: "VND",
              },
              cost: 8,
              categoryId: 2,
              publishDatetime: "12/10/2023",
              description: "This is product 1, it is very good",
              tags: ["tag1", "tag2", "tag3"],
              ownerInfo: {
                id: 1,
                displayName: "MeowMeow shop",
                rating: 4.5,
              },
              attaches: [
                {
                  id: "1",
                  url: "https://picsum.photos/300/300",
                  type: "IMAGE",
                  title: "This is image 1",
                  description: "This is image 1",
                },
                {
                  id: "2",
                  url: "https://picsum.photos/300/300",
                  type: "IMAGE",
                  title: "This is image 2",
                  description: "This is image 2",
                },
                {
                  id: "3",
                  url: "https://picsum.photos/300/300",
                  type: "IMAGE",
                  title: "This is image 3",
                  description: "This is image 3",
                },
              ],
              ratings: 5,
              status: "AVAILABLE",
              type: "NORMAL",
              remainingQuantity: 100,
              maxItemsPerOrder: 10,
              allowDelivery: true,
              paymentMethods: [
                {
                  id: "1",
                  type: "COD",
                },
                {
                  id: "2",
                  type: "ONLINE",
                },
              ],
              category: {
                id: "2",
                name: "Category 2",
              },
              memberOnly: false,
            },
            {
              id: "10",
              name: "Lycoris keychain - Chisato",
              price: {
                value: 10000000,
                unit: "VND",
              },
              cost: 9,
              categoryId: 1,
              publishDatetime: "12/10/2023",
              description: "This is product 1, it is very good",
              tags: ["tag1", "tag2", "tag3"],
              ownerInfo: {
                id: 1,
                displayName: "MeowMeow shop",
                rating: 4.5,
              },
              attaches: [
                {
                  id: "1",
                  url: "https://picsum.photos/300/300",
                  type: "IMAGE",
                  title: "This is image 1",
                  description: "This is image 1",
                },
                {
                  id: "2",
                  url: "https://picsum.photos/300/300",
                  type: "IMAGE",
                  title: "This is image 2",
                  description: "This is image 2",
                },
                {
                  id: "3",
                  url: "https://picsum.photos/300/300",
                  type: "IMAGE",
                  title: "This is image 3",
                  description: "This is image 3",
                },
              ],
              ratings: 5,
              status: "AVAILABLE",
              type: "NORMAL",
              remainingQuantity: 100,
              maxItemsPerOrder: 10,
              allowDelivery: true,
              paymentMethods: [
                {
                  id: "1",
                  type: "COD",
                },
                {
                  id: "2",
                  type: "ONLINE",
                },
              ],
              category: {
                id: "1",
                name: "Category 1",
              },
              memberOnly: false,
            },
          ],
          tags: [
            {
              name: "#hsr",
              description: "5050 products",
              type: "HOT",
              color: "#FF9898",
            },
            {
              name: "#hsr",
              description: "5050 products",
              type: "HOT",
              color: "#FFB571",
            },
            {
              name: "#hsr",
              description: "5050 products",
              type: "HOT",
              color: "#9CA6FF",
            },
            {
              name: "#hsr",
              description: "5050 products",
              type: "HOT",
              color: "#57AC3C",
            },
            {
              name: "#hsr",
              description: "5050 products",
              type: "HOT",
              color: "#FF8179",
            },
            {
              name: "#hsr",
              description: "5050 products",
              type: "HOT",
              color: "#FFB571",
            },
            {
              name: "#hsr",
              description: "5050 products",
              type: "HOT",
              color: "#9CA6FF",
            },
          ],
        },
        {
          data: [
            {
              name: "#hsr",
              description: "5050 products",
              type: "HOT",
              color: "#FF9898",
            },
            {
              name: "#hsr",
              description: "5050 products",
              type: "HOT",
              color: "#FFB571",
            },
            {
              name: "#hsr",
              description: "5050 products",
              type: "HOT",
              color: "#9CA6FF",
            },
            {
              name: "#hsr",
              description: "5050 products",
              type: "HOT",
              color: "#57AC3C",
            },
            {
              name: "#hsr",
              description: "5050 products",
              type: "HOT",
              color: "#FF8179",
            },
            {
              name: "#hsr",
              description: "5050 products",
              type: "HOT",
              color: "#FFB571",
            },
            {
              name: "#hsr",
              description: "5050 products",
              type: "HOT",
              color: "#9CA6FF",
            },
          ],
        },
        {
          data: {
            campaigns: [
              {
                id: "1",
                url: "https://static.wikia.nocookie.net/bangdreamvetnamfandom/images/8/81/Roselia.jpg/revision/latest?cb=20220417065827&path-prefix=vi",
              },
              {
                id: "2",
                url: "https://s3-ap-northeast-1.amazonaws.com/bmu-new-corp-production-public/fc41f61c-8e5b-4a9d-b6aa-8462f8a89283.png",
              },
              {
                id: "3",
                url: "https://static.wikia.nocookie.net/bangdreamvetnamfandom/images/8/81/Roselia.jpg/revision/latest?cb=20220417065827&path-prefix=vi",
              },
            ],
            promotions: [
              {
                id: "2",
                url: "https://s3-ap-northeast-1.amazonaws.com/bmu-new-corp-production-public/fc41f61c-8e5b-4a9d-b6aa-8462f8a89283.png",
              },
              {
                id: "3",
                url: "https://static.wikia.nocookie.net/bangdreamvetnamfandom/images/8/81/Roselia.jpg/revision/latest?cb=20220417065827&path-prefix=vi",
              },
            ],
          },
        },
      ];
    console.log(productRes);
    //@ts-ignore
    hotProducts = productRes.data as Product[];
    hotTags = hotTagsRes.data as Tag[];
    homeBranding = homeBrandingRes.data as HomeBranding;
  } catch (e) {
    console.error(e);
  }

  return { props: { hotProducts, hotTags, homeBranding }, revalidate: 10 };
};

export default HomePage;
