import ssrAxiosClient from "@/services/backend/axiosMockups/ssrAxiosMockupClient";
import { Product, Tag } from "@/types/Product";
import { GetStaticPropsContext, InferGetStaticPropsType, NextPage } from "next";
import Image from "next/image";

const HomePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  products,
  hotTags,
}) => {
  return (
    <div className="px-4 md:px-20">
      <div className="hidden md:block">topnav</div>
      <div>
        <div className="flex gap-6 md:gap-7 flex-col md:flex-row">
          <div className="bg-white h-[31.25rem] flex-1 p-5 ">
            <div className="font-semibold text-xl">
              <div>Hot tags</div>
              <div className="overflow-auto h-full">
                <div className="hidden md:block md:h-[30rem]">
                  {hotTags.map((hotTag) => (
                    <div key={hotTag.id} className="h-40">
                      {hotTag.name}
                    </div>
                  ))}
                </div>
                <div className="flex md:hidden gap-3">
                  {hotTags.map((hotTag) => (
                    <Image
                      className="object-cover rounded-2xl"
                      src={"/assets/karoo.jpg"}
                      alt="carue"
                      width={100}
                      height={40}
                      draggable={false}
                      key={hotTag.id}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 md:mt-[4.875rem]">
        {/* <FilterButtonGroup
          onFilterChange={onFilterChange}
          filterList={filterDashboardList}
        />
        <div className="flex flex-wrap gap-8 gap-x-3.75 justify-center mt-5 md:mt-11 ">
          {products &&
            products.map((product: any, index: number) => (
              <BuyerProductCard key={index} {...product} />
            ))}
        </div> */}
      </div>
    </div>
  );
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  let products: Product[] = [];
  let hotTags: Tag[] = [];
  console.log("ehe");
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
