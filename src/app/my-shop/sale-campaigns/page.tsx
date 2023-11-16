"use client";

import { saleCampaignColumns } from "@/constants/Columns/saleCampaignColumn";
import { ROUTE } from "@/constants/route";
import TableContainer from "@/containers/TableContainer";
import axiosClient from "@/services/backend/axiosClient";
import { SALE_CAMPAIGN_ENDPOINT } from "@/services/backend/services/campaign";
import { useRouter, useSearchParams } from "next/navigation";

const PAGE_SIZE = 6;
const ShopCampaignsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <>
      <div className="flex justify-end mb-4"></div>
      <TableContainer
        fetchKey="campaigns"
        fetcher={async (currentPage) => {
          const res = (
            await axiosClient.get(
              `artist${SALE_CAMPAIGN_ENDPOINT}?pageNumber=${currentPage}&pageSize=${PAGE_SIZE}` +
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
                  router.push(`${ROUTE.SHOP}/sale-campaigns/${el.id}`),
              })),
            },
          };
          return finalRes;
        }}
        columns={saleCampaignColumns}
        pagination
        tableProps={{ verticalSpacing: "sm", className: "font-semibold" }}
        className="mt-2.5"
        header={(response) => (
          <>
            <div className="text-3xl font-bold mb-6">My sale campaigns</div>
          </>
        )}
      />
    </>
  );
};

export default ShopCampaignsPage;
