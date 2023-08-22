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

const ProductDetailPage: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ product, relatedProducts }) => {
  const router = useRouter();

  if (router.isFallback) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  const { description, id, attaches, owner } = product;

  return (
    <>
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
          <ProductInfo
            key={product.id}
            product={product}
            special="Only 5 left"
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
    `/product/${params.id}`
  );

  const { data: productList } = await axiosClient.get<
    CommonResponseBase<PaginationResponseBase<Product>>
  >(`/product?category=${data.data.category.id}`);

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
