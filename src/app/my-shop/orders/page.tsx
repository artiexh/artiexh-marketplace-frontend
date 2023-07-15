"use client";

import TableContainer from "@/containers/TableContainer";
import { useState } from "react";
import shopOrderColumns from "./shopOrderColumns";

const PAGE_SIZE = 6;

const ShopOrdersPage = () => {
  const [searchParams, setSearchParams] = useState<Record<string, string>>({});

  return (
    <TableContainer
      fetchUrl={(currentPage) =>
        `/orders?_page=${currentPage}&_limit=${PAGE_SIZE}` +
        new URLSearchParams(searchParams).toString()
      }
      columns={shopOrderColumns}
      pagination
      tableProps={{ verticalSpacing: "sm", className: "font-semibold" }}
      searchParams={searchParams}
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
