"use client";

import shopCampaignColumns from "@/constants/Columns/shopCampaignColumns";
import { ROUTE } from "@/constants/route";
import TableContainer from "@/containers/TableContainer";
import axiosClient from "@/services/backend/axiosClient";
import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";

const PAGE_SIZE = 6;
const ShopCampaignsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button
          leftIcon={<IconPlus />}
          type="button"
          onClick={() => router.push(`${ROUTE.SHOP}/campaigns/create`)}
          variant="outline"
        >
          Create campaign
        </Button>
      </div>
      <TableContainer
        fetchKey="campaigns"
        fetcher={async (currentPage) => {
          const res = (
            await axiosClient.get(
              `/campaign?page=${currentPage}&pageSize=${PAGE_SIZE}` +
                new URLSearchParams(searchParams?.toString()).toString()
            )
          ).data;
          const finalRes = {
            ...res,
            data: {
              ...res.data,
              items: res.data.items?.map((el: any) => ({
                ...el,
                onClickEdit: () =>
                  router.push(`${ROUTE.SHOP}/campaigns/${el.id}`),
              })),
            },
          };
          console.log(
            "🚀 ~ file: page.tsx:38 ~ fetcher={ ~ finalRes:",
            finalRes
          );
          return finalRes;
        }}
        columns={shopCampaignColumns}
        pagination
        tableProps={{ verticalSpacing: "sm", className: "font-semibold" }}
        className="mt-2.5"
        header={(response) => (
          <>
            <div className="text-3xl font-bold">My campaigns</div>
            <div className="text-[#AFAFAF] mt-1">
              {/* TODO: Replace with API call later or filter based on response */}
              {response?.items?.length} products need to be updated their status
            </div>
          </>
        )}
      />
    </>
  );
};

export default ShopCampaignsPage;
