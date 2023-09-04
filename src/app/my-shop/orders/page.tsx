"use client";

import shopOrderColumns from "@/constants/Columns/shopOrderColumns";
import TableContainer from "@/containers/TableContainer";
import axiosClient from "@/services/backend/axiosClient";
import { getQueryString } from "@/utils/formatter";
import { useState } from "react";

const ShopOrdersPage = () => {
  const [params, setParams] = useState<{ [key: string]: any }>({
    pageSize: 5,
    pageNumber: 1,
    sortBy: null,
    sortDirection: "ASC",
    statuses: null,
    from: null,
    to: null,
  });

  const setField = (key: string, value: any) => {
    setParams({
      ...params,
      [key]: value,
    });
  };

  return (
    <TableContainer
      fetchKey="orders"
      fetcher={async (currentPage) => {
        setField("pageNumber", currentPage);
        return (
          await axiosClient.get(
            `/artist/order?${getQueryString(
              { ...params, pageNumber: currentPage },
              []
            )}`
          )
        ).data;
      }}
      columns={shopOrderColumns()}
      pagination
      tableProps={{ verticalSpacing: "sm", className: "font-semibold" }}
      className="mt-2.5"
      header={(response) => (
        <>
          <div className="text-3xl font-bold">Orders</div>
          <div className="text-[#AFAFAF] mt-1">
            {/* TODO: Replace with API call later or filter based on response */}
            {response?.items.length} products need to be updated their status
          </div>
        </>
      )}
    />
  );
};

export default ShopOrdersPage;
