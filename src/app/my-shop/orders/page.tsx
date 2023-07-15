"use client";

import shopOrderColumns from "@/constants/Columns/shopOrderColumns";
import TableContainer from "@/containers/TableContainer";
import axiosClient from "@/services/backend/axiosMockups/axiosMockupClient";
import { useState } from "react";

const PAGE_SIZE = 6;

const ShopOrdersPage = () => {
  const [searchParams, setSearchParams] = useState<Record<string, string>>({});

  return (
    <TableContainer
      fetcher={(currentPage) => async () =>
        (
          await axiosClient.get(
            `/orders?_page=${currentPage}&_limit=${PAGE_SIZE}` +
              new URLSearchParams(searchParams).toString()
          )
        ).data}
      columns={shopOrderColumns}
      pagination
      tableProps={{ verticalSpacing: "sm", className: "font-semibold" }}
      className="mt-2.5"
      header={(response) => (
        <>
          <div className="text-3xl font-bold">Orders</div>
          <div className="text-[#AFAFAF] mt-1">
            {/* TODO: Replace with API call later or filter based on response */}
            {response?.data.length} products need to be updated their status
          </div>
        </>
      )}
    />
  );
};

export default ShopOrdersPage;
