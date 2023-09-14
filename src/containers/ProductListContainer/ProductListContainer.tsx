import { Category, Product, Tag } from "@/types/Product";
import clsx from "clsx";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import useSWR from "swr";
import axiosClient from "@/services/backend/axiosClient";
import productStyles from "@/styles/Products/ProductList.module.scss";
import ProductPreviewCard from "@/components/Cards/ProductCard/ProductPreviewCard";
import { Badge, Button, Input, Select, Pagination } from "@mantine/core";
import { MobileFilter, Sidebar } from "@/components/ProductList";
import { FC, useEffect, useState } from "react";
import { urlFormatter } from "@/utils/formatter";
import { useRouter } from "next/router";
import MobileSort from "@/components/ProductList/MobileSort";
import { useForm } from "@mantine/form";
import { FilterProps } from "@/services/backend/types/Filter";
import { DEFAULT_FILTERS, SORT_OPTIONS } from "@/constants/ProductList";
import { IconFilter, IconSortAscendingLetters } from "@tabler/icons-react";

type ProductListContainerProps = {
  categories: Category[];
  tags: Tag[];
};

const ProductListContainer: FC<ProductListContainerProps> = ({
  categories,
  tags,
}) => {
  const router = useRouter();
  const params = router.query;

  const [pagination, setPagination] = useState({
    pageSize: 8,
    pageNumber: 1,
    // sortBy: 'cost',
    sortDirection: "ASC",
  });

  const [showPopup, setShowPopup] = useState("");

  const { data: products, isLoading } = useSWR(
    [JSON.stringify(pagination) + JSON.stringify(params)],
    (key) =>
      axiosClient
        .get<CommonResponseBase<PaginationResponseBase<Product>>>(
          urlFormatter("/product", {
            ...pagination,
            ...params,
          })
        )
        .then((res) => res.data.data)
  );

  console.log(products);

  const form = useForm<Partial<FilterProps>>({
    initialValues: DEFAULT_FILTERS,
  });

  const { setValues } = form;

  useEffect(() => {
    // For pagination
    setPagination((prev) => ({
      ...prev,
      pageNumber: 1,
      sortDirection: (params.sortDirection as string) || prev.sortDirection,

      // sortBy: (params.sortBy as string) || prev.sortBy,
    }));
  }, [params]);

  useEffect(() => {
    // Updates on reload
    setValues({
      categoryId: (params.categoryId as string) || DEFAULT_FILTERS.categoryId,
      minPrice: Number(params.minPrice) || DEFAULT_FILTERS.minPrice,
      maxPrice: Number(params.maxPrice) || DEFAULT_FILTERS.maxPrice,
      // averageRate: Number(params.averageRate) || DEFAULT_FILTERS.averageRate,
    });
  }, [params, setValues]);

  const onSort = (value: string | null) => {
    if (!value) return;
    const [key, direction] = value.split("_");
    // sortBy: key,
    // Update pagination
    setPagination((prev) => ({ ...prev, sortDirection: direction }));
    //  Format the URL
    const url = urlFormatter("/product", {
      ...pagination,
      ...params,
      // sortBy: key,
      sortDirection: direction,
    });
    router.replace(url, undefined, { shallow: true });
  };

  const submitHandler = (filters = {}) => {
    const url = urlFormatter("/product", { ...filters, ...pagination });
    router.replace(url, undefined, { shallow: true });
  };

  const resetHandler = () => {
    setValues(DEFAULT_FILTERS);
    submitHandler();
  };

  const openOverlay = (type: "filter" | "sortBy") => {
    document.body.style.overflow = "hidden";
    setShowPopup(type);
  };

  return (
    <>
      {/* Mobile */}
      <div className="bg-white block lg:hidden px-5 py-10">
        <div className="bg-white flex items-center gap-x-4 lg:hidden mt-5">
          <Button
            className="flex-1"
            variant="outline"
            onClick={() => openOverlay("filter")}
            leftIcon={<IconFilter />}
          >
            Bộ lọc
          </Button>
          <Button
            className="flex-1"
            variant="outline"
            onClick={() => openOverlay("sortBy")}
            leftIcon={<IconSortAscendingLetters />}
          >
            Sắp xếp
          </Button>
        </div>
      </div>
      {showPopup && (
        <div
          className="fixed top-0 left-0 bg-black/50 w-screen h-screen z-10"
          onClick={() => {
            console.log(document.body.style.overflow);
            document.body.style.overflow = "auto";
            setShowPopup("");
          }}
        >
          {showPopup === "sortBy" && (
            <MobileSort onSort={onSort} options={SORT_OPTIONS} />
          )}
          {showPopup === "filter" && (
            <MobileFilter
              form={form}
              categories={categories}
              resetHandler={resetHandler}
              submitHandler={submitHandler}
            />
          )}
        </div>
      )}
      {/* Desktop */}
      <h2 className="lg:text-3xl mt-10 lg:mt-10 font-bold lg:px-10">
        Tất cả sản phẩm
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12 mt-4 lg:px-10">
        <Sidebar
          submitHandler={submitHandler}
          categories={categories}
          resetHandler={resetHandler}
          form={form}
        />
        <div className="col-span-9">
          <div className="justify-between items-center hidden lg:flex">
            <div className="flex gap-3">
              {tags.map((tag) => (
                <Badge key={tag.id}>{tag.name}</Badge>
              ))}
            </div>
            {/* <Select
								data={SORT_OPTIONS}
								onChange={onSort}
								value={`${pagination.sortBy}_${pagination.sortDirection}`}
							/> */}
          </div>
          <div
            className={clsx(
              productStyles["product-list-grid"],
              "col-span-4 lg:mt-10"
            )}
          >
            {products?.items?.length ? (
              products.items?.map((product, index) => (
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
          <div className="flex justify-center mt-6 mb-20">
            <Pagination
              value={pagination.pageNumber}
              onChange={(e) =>
                setPagination({
                  ...pagination,
                  pageNumber: e,
                })
              }
              total={products?.totalPage ?? 0}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductListContainer;
