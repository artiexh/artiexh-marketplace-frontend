"use client";

import TableComponent from "@/components/TableComponent";
import shopProductColumns from "@/constants/Columns/shopProductColumns";
import axiosClient from "@/services/backend/axiosClient";
import { SimpleCustomProduct } from "@/types/CustomProduct";
import { ProductInventory } from "@/types/Product";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { TableColumns } from "@/types/Table";
import { getQueryString } from "@/utils/formatter";
import { Badge, Input, Pagination } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

export default function ProductTablePage() {
  const router = useRouter();
  const pathname = usePathname();

  const [params, setParams] = useState<{ [key: string]: any }>({
    pageSize: 8,
    pageNumber: 1,
    sortBy: "productCode",
    sortDirection: "DESC",
    // statuses: null,
    // from: null,
    // to: null,
    // minPrice: null,
    // maxPrice: null,
    // averageRate: null,
    // provinceId: null,
    // categoryId: null,
    keyword: null,
  });

  const setField = (key: string, value: any) => {
    setParams({
      ...params,
      [key]: value,
    });
  };

  const { data: response, isLoading } = useSWR(
    ["product-inventory", ...Object.values(params)],
    () =>
      axiosClient.get<
        CommonResponseBase<PaginationResponseBase<SimpleCustomProduct>>
      >("/product-inventory", {
        params: params,
      })
  );

  const data = response?.data.data;

  return (
    <div className="product-table-page">
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
        {/* <Button
          leftIcon={<IconPlus />}
          type="button"
          onClick={() => router.push(`/my-shop/custom-products/create`)}
          variant="outline"
        >
          Create product
        </Button> */}
      </div>
      <div className="py-5 px-7 bg-white rounded-lg">
        <>
          <div className="text-3xl font-bold">Products</div>
          <div className="text-[#AFAFAF] mt-1 mb-4">
            {/* TODO: Replace with API call later or filter based on response */}
            {data?.totalSize} products
          </div>
        </>
        <div className="flex flex-col items-center gap-4 w-full">
          {!isLoading && (
            <TableComponent
              columns={shopProductColumns}
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
}
