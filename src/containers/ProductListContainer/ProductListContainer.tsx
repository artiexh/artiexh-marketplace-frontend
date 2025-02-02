import ProductPreviewCard from "@/components/Cards/ProductCard/ProductPreviewCard";
import NotFoundComponent from "@/components/NotFoundComponents/NotFoundComponent";
import { MobileFilter, Sidebar } from "@/components/ProductList";
import MobileSort from "@/components/ProductList/MobileSort";
import { DEFAULT_FILTERS, SORT_OPTIONS } from "@/constants/ProductList";
import { notfoundMessages } from "@/constants/notfoundMesssages";
import axiosClient from "@/services/backend/axiosClient";
import { FilterProps } from "@/services/backend/types/Filter";
import productStyles from "@/styles/Products/ProductList.module.scss";
import { Category, Product, Tag } from "@/types/Product";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { getQueryString } from "@/utils/formatter";
import { Button, Loader, Menu, Pagination } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconFilter, IconSortAscendingLetters } from "@tabler/icons-react";
import clsx from "clsx";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import useSWR from "swr";

type ProductListContainerProps = {
  categories: Category[];
  tags: Tag[];
  endpoint: string;
  pathName: string;
};

const ProductListContainer: FC<ProductListContainerProps> = ({
  categories,
  tags,
  endpoint,
  pathName,
}) => {
  const router = useRouter();
  const params = router.query;

  const [pagination, setPagination] = useState({
    pageSize: 8,
    pageNumber: 1,
    sortBy: "_id",
    sortDirection: "DESC",
  });

  const [showPopup, setShowPopup] = useState("");

  const { data: products, isLoading } = useSWR(
    [JSON.stringify(pagination) + JSON.stringify(params)],
    (key) => {
      const { id, ...rest } = params;
      return axiosClient
        .get<CommonResponseBase<PaginationResponseBase<Product>>>(
          `/${endpoint}?${getQueryString(
            {
              ...rest,
              ...pagination,
            },
            []
          )}`
        )
        .then((res) => res.data.data);
    }
  );

  const form = useForm<Partial<FilterProps>>({
    initialValues: DEFAULT_FILTERS,
  });

  const { setValues } = form;

  useEffect(() => {
    // For pagination
    setPagination((prev) => ({
      ...prev,
      pageNumber: Number(params.pageNumber as string) || 1,
      // sortDirection: (params.sortDirection as string) || prev.sortDirection,
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

    let url = "";
    if (direction === "DEFAULT") {
      setPagination((prev) => ({
        ...prev,
        pageNumber: 1,
      }));

      url = getQueryString(
        {
          ...pagination,
          pageNumber: 1,
        },
        []
      );
    } else {
      setPagination((prev) => ({
        ...prev,
        sortBy: key,
        sortDirection: direction,
        pageNumber: 1,
      }));
      //  Format the URL
      url = getQueryString(
        {
          ...pagination,
          ...params,
          sortBy: key,
          sortDirection: direction,
          pageNumber: 1,
        },
        []
      );
    }

    router.replace(`${pathName}?${url}`, undefined, {
      shallow: true,
    });
  };

  const submitHandler = (filters = {}) => {
    const url = getQueryString({ ...filters }, []);
    router.replace(`${pathName}${url ? `?${url}` : ""}`, undefined, {
      shallow: true,
    });
  };

  const resetHandler = () => {
    router.replace(pathName, undefined, { shallow: true });
    setValues(DEFAULT_FILTERS);
  };

  const openOverlay = (type: "filter" | "sortBy") => {
    document.body.style.overflow = "hidden";
    setShowPopup(type);
  };

  return (
    <>
      {/* Mobile */}
      <div className="bg-white block lg:hidden py-10 mt-10 rounded-lg px-6">
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
          className="fixed top-0 left-0 bg-black/50 w-screen h-screen z-50"
          onClick={() => {
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
      <h2 className="lg:text-3xl mt-10 lg:mt-10 font-bold ">Tất cả sản phẩm</h2>
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12 mt-4 ">
        <Sidebar
          submitHandler={submitHandler}
          categories={categories}
          resetHandler={resetHandler}
          form={form}
        />
        <div className="col-span-9">
          <div className="flex justify-end mb-6">
            <Menu shadow="md" width={200} trigger="hover">
              <Menu.Target>
                <Button className="bg-primary !text-white">Sắp xếp</Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      sortBy: "price.amount",
                      sortDirection: "DESC",
                      pageNumber: 1,
                    }))
                  }
                >
                  Giá từ cao đến thấp
                </Menu.Item>
                <Menu.Item
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      sortBy: "price.amount",
                      sortDirection: "ASC",
                      pageNumber: 1,
                    }))
                  }
                >
                  Giá từ thấp đến cao
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    setPagination({
                      pageSize: 8,
                      pageNumber: 1,
                      sortBy: "_id",
                      sortDirection: "DESC",
                    });
                  }}
                >
                  Mặc định
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
          <div className="justify-between items-center hidden lg:flex">
            {/* <div className="flex gap-3">
              {tags.map((tag) => (
                <Badge key={tag.id}>{tag.name}</Badge>
              ))}
            </div> */}
            {/* <Select
								data={SORT_OPTIONS}
								onChange={onSort}
								value={`${pagination.sortBy}_${pagination.sortDirection}`}
							/> */}
          </div>
          {isLoading ? null : (
            <div
              className={clsx(productStyles["product-list-grid"], "col-span-4")}
            >
              {products?.items?.length ? (
                products.items?.map((product, index) => (
                  <ProductPreviewCard data={product} key={index} />
                ))
              ) : (
                <div className="col-span-4">
                  <NotFoundComponent
                    title={notfoundMessages.NOT_FOUND_PRODUCTS}
                  />
                </div>
              )}
            </div>
          )}
          <div className="flex justify-center mt-6 mb-20">
            <Pagination
              value={pagination.pageNumber}
              onChange={(e) => {
                const url = getQueryString(
                  {
                    ...pagination,
                    ...params,
                    pageNumber: e,
                  },
                  []
                );
                router.replace(`${pathName}?${url}`, undefined, {
                  shallow: true,
                });
                setPagination((prev) => ({ ...prev, pageNumber: e }));
              }}
              total={products?.totalPage ?? 0}
              classNames={{
                control: "[&[data-active]]:!text-white",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductListContainer;
