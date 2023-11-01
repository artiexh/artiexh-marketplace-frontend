import ProductPreviewCard from "@/components/Cards/ProductCard/ProductPreviewCard";
import CategoryButton from "@/components/CategoryButton/CategoryButton";
import SortButton from "@/components/SortButton/SortButton";
import { paginationFetcher } from "@/services/backend/axiosClient";
import productStyles from "@/styles/Products/ProductList.module.scss";
import { Product } from "@/types/Product";
import { Select } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import useSWRInfinite from "swr/infinite";

const CampaignProductList = () => {
  const params = useSearchParams();
  const id = params?.get("id");

  function getKey(pageNumber: number, previousPageData: Product[]) {
    if (pageNumber && !previousPageData.length) return null; // reached the end
    return `/marketplace/campaign/${id}/product?pageNumber=${
      pageNumber + 1
    }&pageSize=8&sortBy=id&sortDirection=DESC`; // SWR key
  }

  const { data, size, setSize } = useSWRInfinite(
    getKey,
    paginationFetcher<Product>
  );

  const [scroll] = useWindowScroll();

  useEffect(() => {
    console.log(scroll, size, window.screen.height);

    if (scroll.y > window.screen.height * size) {
      setSize((prev) => prev + 1);
    }
  }, [scroll]);

  return (
    <div>
      <div className="font-semibold text-2xl mb-10">
        Tất cả sản phẩm của campaign
      </div>
      <div className="campaign-list-page md:flex">
        <div className="w-[300px] hidden md:block">
          <div className="text-lg font-bold">Lọc theo</div>
          <div className="mt-6 mb-2 text-sm text-gray-500">Danh mục</div>
          <div className="text-sm">
            <div className="cursor-pointer">Tất cả</div>
            <div className="my-2 cursor-pointer">T-Shirt</div>
            <div className="cursor-pointer">Tote bag</div>
          </div>
        </div>
        <div className="md:hidden flex gap-2">
          <CategoryButton />
          <SortButton />
        </div>
        <div>
          <div className="items-center gap-2 justify-end hidden md:flex ">
            <div>Sắp xếp theo:</div>
            <div>
              <Select
                placeholder="Tiêu chí"
                data={["Tất cả", "Mới nhất", "Cũ nhất"]}
              />
            </div>
          </div>
          <div
            className={clsx(
              productStyles["product-list-grid"],
              "col-span-4 lg:mt-10"
            )}
          >
            {data?.flat().length ? (
              data
                ?.flat()
                ?.map((product, index) => (
                  <ProductPreviewCard data={product} key={index} />
                ))
            ) : (
              <div className="col-span-4">
                <h2 className="text-lg font-semibold text-centers">
                  Cannot find any items matching the criteria
                </h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignProductList;
