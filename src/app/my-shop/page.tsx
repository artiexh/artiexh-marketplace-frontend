"use client";

import TableContainer from "@/containers/TableContainer";
import { Button, Input } from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import shopProductColumns from "@/constants/Columns/shopProductColumns";
import { useState } from "react";
import { getQueryString } from "@/utils/formatter";
import axiosClient from "@/services/backend/axiosClient";

const ShopProductsPage = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [params, setParams] = useState<{ [key: string]: any }>({
    pageSize: 5,
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
          onClick={() => router.push(pathname + "/create")}
          variant="outline"
        >
          Create product
        </Button>
      </div>
      <TableContainer
        fetchKey="products"
        fetcher={async (currentPage) => {
          setField("pageNumber", currentPage);
          return (
            await axiosClient.get(
              `/artist/product?${getQueryString(
                { ...params, pageNumber: currentPage },
                []
              )}`
            )
          ).data;
        }}
        columns={shopProductColumns}
        pagination
        tableProps={{ verticalSpacing: "sm", className: "font-semibold" }}
        className="mt-2.5"
        header={(response) => (
          <>
            <div className="text-3xl font-bold">Products</div>
            <div className="text-[#AFAFAF] mt-1">
              {/* TODO: Replace with API call later or filter based on response */}
              {response?.items.length} products need to be updated their status
            </div>
          </>
        )}
      />
    </div>
  );
};

export default ShopProductsPage;
