import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import ProductListContainer from "@/containers/ProductListContainer/ProductListContainer";
import axiosClient from "@/services/backend/axiosClient";
import { Category, Tag } from "@/types/Product";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { User } from "@/types/User";
import { useQuery } from "@tanstack/react-query";
import { GetStaticPaths, InferGetStaticPropsType, NextPage } from "next";
import { useRouter, useSearchParams } from "next/navigation";

const ShopProductListPage: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ categories, tags }) => {
  const params = useSearchParams();
  const name = params?.get("name");
  const router = useRouter();

  const { data: artist } = useQuery({
    queryKey: [name],
    queryFn: async () => {
      const { data } = await axiosClient.get<CommonResponseBase<User>>(
        `/artist/${name}`
      );

      return data.data;
    },
  });

  return (
    <>
      {artist ? (
        <div
          className="cursor-pointer"
          onClick={() => router.push(`/shop/${artist.username}/home`)}
        >
          <ImageWithFallback
            className="w-full h-[200px] object-cover"
            src={
              artist.shopThumbnailUrl ??
              "https://i.pinimg.com/originals/ee/26/8c/ee268cf73e3850486966244fe34605d6.png"
            }
            alt="img"
            width={200}
            height={150}
          />
          <div className="md:top-0 flex gap-6 items-center px-6 py-4 bg-white shadow">
            <div className="">
              <ImageWithFallback
                src={artist.avatarUrl}
                className="w-[120px] h-[120px] object-cover rounded-full mx-auto"
                alt="img"
                width={120}
                height={120}
              />
            </div>
            <div className="">
              <div className="font-bold text-xl">{artist.displayName}</div>
            </div>
          </div>
        </div>
      ) : null}
      <ProductListContainer
        endpoint={`marketplace/artist/${name}/product-in-sale`}
        categories={categories}
        tags={tags}
        pathName={`/shop/${name}/product`}
      />
    </>
  );
};

export default ShopProductListPage;

export async function getStaticProps() {
  const [{ data: categories }, { data: tags }] = await Promise.all([
    axiosClient.get<CommonResponseBase<PaginationResponseBase<Category>>>(
      "/category"
    ),
    axiosClient.get<CommonResponseBase<PaginationResponseBase<Tag>>>("/tag"),
  ]);

  return {
    props: { categories: categories.data.items, tags: tags.data.items },
    revalidate: 2,
  };
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};
