import TableComponent from "@/components/TableComponent";
import { productInSaleColumns } from "@/constants/Columns/productInSaleColumns";
import axiosClient from "@/services/backend/axiosClient";

import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";

import { ProductInSale, SaleCampaignDetail } from "@/types/SaleCampaign";
import { Pagination } from "@mantine/core";

import { useQuery } from "@tanstack/react-query";

import { useState } from "react";

const PAGE_SIZE = 6;

export default function SaleCampaignProductTab({
  data,
}: {
  data: SaleCampaignDetail;
}) {
  const [query, setQuery] = useState({
    pageNumber: 1,
    pageSize: PAGE_SIZE,
  });

  const { data: productResponse, refetch: mutate } = useQuery({
    queryKey: ["sale-campaign-product", { id: data.id }, { ...query }],
    queryFn: async () => {
      const res = await axiosClient.get<
        CommonResponseBase<PaginationResponseBase<ProductInSale>>
      >(
        `/sale-campaign/${data.id}/product-in-sale?${new URLSearchParams({
          pageNumber: query.pageNumber.toString(),
          pageSize: query.pageSize.toString(),
        }).toString()}`
      );

      return res.data;
    },
  });

  return (
    <div className="sale-campaign-product-tab">
      <TableComponent
        columns={productInSaleColumns}
        data={productResponse?.data.items}
      />
      <div className="mt-5 flex justify-center w-full">
        <Pagination
          value={query.pageNumber}
          onChange={(page) =>
            setQuery((prev) => ({
              ...prev,
              pageNumber: page,
            }))
          }
          total={productResponse?.data.totalPage ?? 1}
          boundaries={2}
        />
      </div>
    </div>
  );
}
