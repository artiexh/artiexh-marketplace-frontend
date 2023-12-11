"use client";

import TableComponent from "@/components/TableComponent";
import { saleCampaignColumns } from "@/constants/Columns/saleCampaignColumn";
import axiosClient from "@/services/backend/axiosClient";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { PaginationQuery, queryDefaultMapper } from "@/utils/query";
import { DatePickerInput } from "@mantine/dates";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import { Pagination } from "@mantine/core";
import { SALE_CAMPAIGN_ENDPOINT } from "@/services/backend/services/campaign";

const PAGE_SIZE = 8;
const ShopCampaignsPage = () => {
  const router = useRouter();
  const [query, setQuery] = useState<
    PaginationQuery & {
      status?: string;
      from?: string;
      to?: string;
    }
  >({
    pageSize: PAGE_SIZE,
  });

  const { data: saleCampaignResponse } = useSWR<
    CommonResponseBase<PaginationResponseBase<any>>
  >(JSON.stringify(query), async () => {
    try {
      const result = await axiosClient.get(
        `artist${SALE_CAMPAIGN_ENDPOINT}?${new URLSearchParams(
          queryDefaultMapper(query)
        )
          .toString()
          .trim()}`
      );
      return result.data;
    } catch (e) {
      console.log(e);
    }
  });

  return (
    <div className="py-5 px-7 bg-white shadow rounded-lg">
      <div className="flex justify-between items-center mb-10">
        <div className="text-3xl font-bold">My sale campaigns</div>
        <div className="w-[400px]">
          <DatePickerInput
            type="range"
            allowSingleDateInRange
            clearable
            placeholder="Pick dates"
            onChange={(values) => {
              setQuery((prev) => ({
                ...prev,
                from: values?.[0] ? values[0].toISOString() : undefined,
                to: values?.[1] ? values[1].toISOString() : undefined,
              }));
            }}
            mx="auto"
            maw={400}
          />
        </div>
      </div>
      <TableComponent
        columns={saleCampaignColumns}
        tableProps={{ verticalSpacing: "sm", className: "font-semibold" }}
        data={saleCampaignResponse?.data.items.map((el) => ({
          ...el,
          onView: () => {
            router.push(`/my-shop/sale-campaigns/${el.id}`);
          },
        }))}
      />
      <div className="flex justify-end">
        <Pagination
          className="mt-10"
          value={query.pageNumber ?? 1}
          onChange={(value: number) => {
            console.log(value);
            setQuery((prev) => ({
              ...prev,
              pageNumber: value,
            }));
          }}
          //TODO: change this to total of api call later
          total={saleCampaignResponse?.data.totalPage ?? 1}
          boundaries={2}
          classNames={{
            control: "[&[data-active]]:!text-white",
          }}
        />
      </div>
    </div>
  );
};

export default ShopCampaignsPage;
