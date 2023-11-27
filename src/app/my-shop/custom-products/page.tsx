"use client";

import PrivateImageLoader from "@/components/PrivateImageLoader/PrivateImageLoader";
import TableComponent from "@/components/TableComponent";
import axiosClient from "@/services/backend/axiosClient";
import { SimpleCustomProduct } from "@/types/CustomProduct";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { TableColumns } from "@/types/Table";
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
    pageSize: 5,
    pageNumber: 1,
    sortBy: null,
    sortDirection: "ASC",
  });

  const { data: response, isLoading } = useSWR(
    ["custom-product", ...Object.values(params)],
    () =>
      axiosClient.get<
        CommonResponseBase<PaginationResponseBase<SimpleCustomProduct>>
      >("/custom-product", {
        params: {
          ...params,
          sortBy: "id",
          sortDirection: "DESC",
        },
      })
  );

  const data = response?.data.data;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          leftIcon={<IconPlus />}
          type="button"
          onClick={() => router.push(`/my-shop/custom-products/create`)}
          variant="outline"
        >
          Create product
        </Button>
      </div>
      <div className="py-5 px-7 bg-white shadow rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="text-3xl font-bold">Custom products</div>
            <div className="text-[#AFAFAF] mt-1">
              {/* TODO: Replace with API call later or filter based on response */}
              {data?.totalSize} custom products
            </div>
          </div>
          <div>
            <Input
              className="w-[300px]"
              icon={<IconSearch />}
              placeholder="Search by product name..."
              onChange={(e) => {
                setParams({
                  ...params,
                  name: e.target.value,
                  pageNumber: 1,
                });
              }}
            />
          </div>
        </div>
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
            onChange={(value) => setParams({ ...params, pageNumber: value })}
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
  SimpleCustomProduct & {
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
            className="rounded-md object-fill w-full h-full"
            id={record.modelThumbnail?.id.toString()}
            alt="test"
          />
        </div>
        <div>
          <div>{record.name}</div>
          <div className="text-sm text-gray-500">
            Template: {record.category.name}
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
          if (!combination.optionValue)
            return prev + `${combination.option.name}: N/A; `;

          return (
            prev +
            `${combination.option.name}: ${combination.optionValue.name}; `
          );
        }, "")}
      </span>
    ),
  },
  {
    title: "Updated time",
    key: "modifiedDate",
    render: (record) => (
      <span>
        {new Intl.DateTimeFormat("vi", {
          dateStyle: "long",
          timeStyle: "medium",
        }).format(new Date(record.modifiedDate))}
      </span>
    ),
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
