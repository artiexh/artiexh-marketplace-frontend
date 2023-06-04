import ProductPreviewCard from "@/components/Cards/ProductCard/ProductPreviewCard";
import Layout from "@/layouts/Layout/Layout";
import ssrAxiosClient from "@/services/backend/axiosMockups/ssrAxiosMockupClient";
import { Product, Tag } from "@/types/Product";
import { GetStaticPropsContext, InferGetStaticPropsType, NextPage } from "next";

const HomePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  products,
  hotTags,
}) => {
  return (
    <Layout>
      <div className="flex flex-col gap-16">
        <div className="flex h-[27rem] gap-4">
          <div className="w-3/4 flex-shrink-0 from-[#F10487] to-[#8924C2] bg-gradient-to-br rounded-xl" />
          <div className="flex flex-col w-full gap-8">
            <div className="flex-1 bg-[#D9D9D9] rounded-xl" />
            <div className="flex-1 bg-[#D9D9D9] rounded-xl" />
          </div>
        </div>
        <div>
          <div>Trending tags:</div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 mt-3">
            {hotTags.map(({ color, description, name }, index) => (
              <div
                key={index}
                className="text-center p-6 text-white"
                style={{ backgroundColor: color }}
              >
                <div className="font-bold">{name}</div>
                <div className="text-xs">{description}</div>
              </div>
            ))}
          </div>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-5">
            {products.slice(0, 5).map((product, index) => (
              <ProductPreviewCard data={product} key={index} />
            ))}
          </div>
        </div>
        <div>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-3">
            {products.map((product, index) => (
              <ProductPreviewCard data={product} key={index} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  let products: Product[] = [];
  let hotTags: Tag[] = [];
  try {
    const [{ data: productData }, { data: hotTagsData }] = await Promise.all([
      ssrAxiosClient.get<Product[]>("/products"),
      ssrAxiosClient.get<Tag[]>("/dashboardHotTags"),
    ]);
    products = productData;
    hotTags = hotTagsData;
  } catch (e) {
    console.error(e);
  }

  return { props: { products, hotTags }, revalidate: 10 };
};

export default HomePage;
