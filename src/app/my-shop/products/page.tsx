"use client";

import TableComponent from "@/components/TableComponent";
import shopProductColumns from "@/constants/Columns/shopProductColumns";
import axiosClient from "@/services/backend/axiosClient";
import { $user } from "@/store/user";
import { SimpleCustomProduct } from "@/types/CustomProduct";
import { ProductInventory } from "@/types/Product";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { Input, Pagination } from "@mantine/core";
import { useStore } from "@nanostores/react";
import { IconSearch } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

export default function ProductTablePage() {
  const user = useStore($user);
  const router = useRouter();
  const pathname = usePathname();

  const [params, setParams] = useState<{ [key: string]: any }>({
    pageSize: 5,
    pageNumber: 1,
    sortBy: "createdDate",
    sortDirection: "DESC",
    keyword: null,
    ownerId: user?.id,
  });

  const { data: response, isLoading } = useSWR(
    ["product-inventory", ...Object.values(params)],
    () =>
      axiosClient.get<
        CommonResponseBase<PaginationResponseBase<ProductInventory>>
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
            <div className="text-3xl font-bold">Hàng trong kho</div>
            {data?.totalSize ? (
              <div className="text-[#AFAFAF] mt-1 mb-4">
                {/* TODO: Replace with API call later or filter based on response */}
                {data?.totalSize} sản phẩm
              </div>
            ) : null}
          </div>
          <div>
            <Input
              className="w-[300px]"
              icon={<IconSearch />}
              placeholder="Tìm kiếm bằng mã sản phẩm..."
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
                  onView: () => {
                    router.push(`/my-shop/products/${item.productCode}`);
                  },
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
            classNames={{
              control: "[&[data-active]]:!text-white",
            }}
          />
        </div>
      </div>
    </div>
  );
}
