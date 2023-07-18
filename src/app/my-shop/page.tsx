"use client";

import shopProductColumns from "@/constants/Columns/shopProductColumns";
import TableContainer from "@/containers/TableContainer";
import axiosClient from "@/services/backend/axiosMockups/axiosMockupClient";
import { createQueryString } from "@/utils/searchParams";
import { Button, Input } from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const PAGE_SIZE = 6;

const ShopProductsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Input
          icon={<IconSearch />}
          onChange={(e) =>
            createQueryString(searchParams, "_like", e.target.value)
          }
        />
        <Button
          leftIcon={<IconPlus />}
          type="button"
          onClick={() => router.push("/artist/create")}
          variant="outline"
        >
          Create product
        </Button>
      </div>
      <TableContainer
        key="products"
        fetcher={(currentPage) => async () => {
          const ret = (
            await axiosClient.get(
              `/products?_page=${currentPage}&_limit=${PAGE_SIZE}` +
                new URLSearchParams(searchParams?.toString()).toString()
            )
          ).data;
          return ret;
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
              {response?.data.length} products need to be updated their status
            </div>
          </>
        )}
      />
    </div>
  );
};

export default ShopProductsPage;
