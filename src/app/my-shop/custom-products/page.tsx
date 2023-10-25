"use client";

import PrivateImageLoader from "@/components/PrivateImageLoader/PrivateImageLoader";
import TableComponent from "@/components/TableComponent";
import axiosClient from "@/services/backend/axiosClient";
import { SimpleDesignItem } from "@/types/DesignItem";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { TableColumns } from "@/types/Table";
import { getQueryString } from "@/utils/formatter";
import { Button, Input, Pagination, Tooltip } from "@mantine/core";
import {
  IconBallpen,
  IconPalette,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

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
          onClick={() => router.push(`/my-shop/custom-products/create`)}
          variant="outline"
        >
          Create product
        </Button>
      </div>
      <div className="py-5 px-7 bg-white rounded-lg">
        <>
          <div className="text-3xl font-bold">Custom products</div>
          <div className="text-[#AFAFAF] mt-1">
            {/* TODO: Replace with API call later or filter based on response */}
            {data?.totalSize} custom products
          </div>
        </>
        <div className="flex flex-col items-center gap-4 w-full">
          {!isLoading && (
            <TableComponent
              columns={customProductColumns}
              data={data?.items.map((item) => {
                return {
                  ...item,
                  onDesign: () =>
                    router.push(`/my-shop/custom-products/${item.id}/design`),
                  onEdit: () =>
                    router.push(`/my-shop/custom-products/${item.id}/details`),
                };
              })}
            />
          )}
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
            className="rounded-md"
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
        <Tooltip label="Edit">
          <IconBallpen
            className="cursor-pointer"
            onClick={() => record.onEdit && record.onEdit()}
          />
        </Tooltip>
        <Tooltip label="Desgin">
          <IconPalette
            className="cursor-pointer"
            onClick={() => record.onDesign && record.onDesign()}
          />
        </Tooltip>
      </div>
    ),
  },
];

export default ShopProductsPage;
