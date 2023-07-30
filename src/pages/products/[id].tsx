import { CustomBreadcrumbs } from "@/components/Breadcrumbs";
import ProductPreviewCard from "@/components/Cards/ProductCard/ProductPreviewCard";
import Description from "@/components/ProductDetail/Description/Description";
import ProductInfo from "@/containers/ProductInfo/ProductInfo";
import ShopCard from "@/components/ProductDetail/ShopCard/ShopCard";
import ssrAxiosClient from "@/services/backend/axiosMockups/ssrAxiosMockupClient";
import { Product } from "@/types/Product";
import { CommonResponseBase } from "@/types/ResponseBase";
import { Carousel } from "@mantine/carousel";
import { GetStaticPropsContext, InferGetStaticPropsType, NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";

const ProductDetailPage: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ product }) => {
  const router = useRouter();

  if (router.isFallback) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  const { description, id, attaches, ownerInfo } = product;

  return (
    <>
      <nav>Navbar</nav>
      <div className="page-wrapper max-w-7xl px-5 md:px-10 mx-auto mt-10 pb-5">
        <CustomBreadcrumbs />
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
                <div className="flex h-[460px] bg-white">
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
          <ProductInfo product={product} special="Only 5 left" />
          <Description description={description} />
          <ShopCard className="col-span-12 md:col-span-5" artist={ownerInfo} />
        </div>
        <h2 className="font-bold text-lg mt-10">Might interest you</h2>
        <div className="interest-wrapper grid grid-cols-4 md:grid-cols-10 gap-5 mt-5">
          {[...Array<Product>(10).fill(product)].map((product, index) => (
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

export const getStaticPaths = async () => {
  try {
    const {
      data: { data },
    } = await ssrAxiosClient.get<CommonResponseBase<Product[]>>("/products");
    console.log(data);
    const paths = data.map((product) => ({
      params: { id: `${product.id}` },
    }));
    return {
      paths,
      fallback: true,
    };
  } catch (error) {
    console.log(error);
    return {
      paths: [],
      fallback: true,
    };
  }
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  // const { params } = context;
  // if (!params?.id) return { props: {} };
  // const { data } = await ssrAxiosClient.get<CommonResponseBase<Product>>(
  //   `/products/${params.id}`
  // );

  const product: Product = {
    id: "1",
    name: "Lycoris keychain - Chisato",
    price: {
      value: 10000000,
      unit: "VND",
    },
    publishDatetime: "12/10/2023",
    description: "This is product 1, it is very good",
    tags: ["tag1", "tag2", "tag3"],
    ownerInfo: {
      id: 1,
      displayName: "MeowMeow shop",
      rating: 4.5,
      username: "meowmeow",
      role: "user",
      subscriptionsTo: [],
      status: "active",
    },
    thumbnailUrl: "https://picsum.photos/300/300",
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
  };
  return {
    props: {
      product: product,
    },
  };
};

export default ProductDetailPage;
