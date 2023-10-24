"use client";

import TableContainer from "@/containers/TableContainer";
import { Button, Input, Pagination } from "@mantine/core";
import {
  IconBallpen,
  IconPalette,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import shopProductColumns from "@/constants/Columns/shopProductColumns";
import { useState } from "react";
import { getQueryString } from "@/utils/formatter";
import axiosClient from "@/services/backend/axiosClient";
import { ROUTE } from "@/constants/route";
import useSWR from "swr";
import TableComponent from "@/components/TableComponent";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { SimpleDesignItem } from "@/types/DesignItem";
import { TableColumns } from "@/types/Table";
import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import PrivateImageLoader from "@/components/PrivateImageLoader/PrivateImageLoader";

const ShopProductsPage = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [params, setParams] = useState<{ [key: string]: any }>({
    pageSize: 8,
    pageNumber: 1,
    sortBy: null,
    sortDirection: "ASC",
    statuses: null,
    from: null,
    to: null,
    minPrice: null,
    maxPrice: null,
    averageRate: null,
    provinceId: null,
    categoryId: null,
    keyword: null,
  });

  const setField = (key: string, value: any) => {
    setParams({
      ...params,
      [key]: value,
    });
  };

  const { data: response, isLoading } = useSWR(
    ["custom-product", ...Object.values(params)],
    () =>
      axiosClient.get<
        CommonResponseBase<PaginationResponseBase<SimpleDesignItem>>
      >("/inventory-item", {
        params: params,
      })
  );

  const data = response?.data.data;

  if (isLoading) return null;

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Input
          icon={<IconSearch />}
          onChange={(e) => {
            setField("keyword", e.target.value);
            router.push(
              `${pathname}?${getQueryString(
                { ...params, keyword: e.target.value },
                []
              )}`
            );
          }}
        />
        <Button
          leftIcon={<IconPlus />}
          type="button"
          onClick={() => router.push(`${ROUTE.SHOP}/products/create`)}
          variant="outline"
        >
          Create product
        </Button>
      </div>
      <div className="py-5 px-7 bg-white rounded-lg">
        <>
          <div className="text-3xl font-bold">Products</div>
          <div className="text-[#AFAFAF] mt-1">
            {/* TODO: Replace with API call later or filter based on response */}
            {data?.items.length} products need to be updated their status
          </div>
        </>
        <div className="flex flex-col items-center gap-4 w-full">
          <TableComponent
            columns={customProductColumns}
            data={data?.items.map((item) => {
              return {
                ...item,
                onDesign: () => router.push(`/product-design/${item.id}`),
                onEdit: () => router.push(`/my-shop/products/${item.id}`),
              };
            })}
          />
          <Pagination
            value={params.pageNumber}
            onChange={(value) => setField("pageNumber", value)}
            //TODO: change this to total of api call later
            total={data?.totalPage ?? 1}
            boundaries={2}
          />
        </div>
      </div>
    </div>
  );
};

const customProductColumns: TableColumns<
  SimpleDesignItem & {
    onDesign: Function;
    onEdit: Function;
  }
> = [
  {
    title: "Name",
    key: "name",
    render: (record) => (
      <div className="flex items-center gap-5">
        <div className="relative w-16 aspect-square">
          <PrivateImageLoader
            id={record.thumbnail?.id.toString()}
            alt="test"
            fill
          />
        </div>
        <div>
          <div>{record.name}</div>
          <div className="text-sm text-gray-500">
            Template: {record.variant.productBase.name}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Variant",
    key: "variant",
    render: (record) => (
      <span>
        {record.variant.variantCombinations.reduce((prev, combination) => {
          const option = record.variant.productBase.productOptions.find(
            (o) => o.id === combination.optionId
          );
          const value = option?.optionValues?.find(
            (v) => v.id === combination.optionValueId
          );
          if (!option) return prev;

          if (!value) return prev + `${option.name}: N/A; `;

          return prev + `${option.name}: ${value.name}; `;
        }, "")}
      </span>
    ),
  },
  {
    title: "Description",
    key: "description",
    render: (record) => <span>{record.description}</span>,
  },
  {
    title: "Action",
    key: "action",
    className: "!text-center",
    render: (record) => (
      <div className="flex justify-center gap-x-2">
        <IconBallpen
          className="cursor-pointer"
          onClick={() => record.onEdit && record.onEdit()}
        />
        <IconPalette
          className="cursor-pointer"
          onClick={() => record.onDesign && record.onDesign()}
        />
      </div>
    ),
  },
];

export default ShopProductsPage;
