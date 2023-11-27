"use client";

import TableComponent from "@/components/TableComponent";
import shopProductColumns from "@/constants/Columns/shopProductColumns";
import axiosClient from "@/services/backend/axiosClient";
import { SimpleCustomProduct } from "@/types/CustomProduct";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { Input, Pagination } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

export default function ProductTablePage() {
  const router = useRouter();
  const pathname = usePathname();

  const [params, setParams] = useState<{ [key: string]: any }>({
    pageSize: 5,
    pageNumber: 1,
    sortBy: "createdDate",
    sortDirection: "DESC",
    keyword: null,
  });

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
      <div className="py-5 px-7 bg-white shadow rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="text-3xl font-bold">Products</div>
            <div className="text-[#AFAFAF] mt-1 mb-4">
              {/* TODO: Replace with API call later or filter based on response */}
              {data?.totalSize} products
            </div>
          </div>
          <div>
            <Input
              className="w-[300px]"
              icon={<IconSearch />}
              placeholder="Search by product code..."
              onChange={(e) => {
                setParams({
                  ...params,
                  productCode: e.target.value,
                  pageNumber: 1,
                });
              }}
            />
          </div>
        </div>
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
            onChange={(value) => setParams({ ...params, pageNumber: value })}
            //TODO: change this to total of api call later
            total={data?.totalPage ?? 1}
            boundaries={2}
          />
        </div>
      </div>
    </div>
  );
}
