import CampaignPreviewCard from "@/components/CampaignPreviewCard/CampaignPreviewCard";
import NotFoundComponent from "@/components/NotFoundComponents/NotFoundComponent";
import { notfoundMessages } from "@/constants/notfoundMesssages";
import { paginationFetcher } from "@/services/backend/axiosClient";
import { CampaignData } from "@/types/Campaign";
import { getQueryString } from "@/utils/formatter";
import { Input } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import useSWRInfinite from "swr/infinite";

export default function CampaignListPage() {
  const [searchValue, setSearchValue] = useState<string>();

  const getKey = useCallback(
    () =>
      function getKey(pageNumber: number, previousPageData: CampaignData[]) {
        if (pageNumber && !previousPageData.length) return null; // reached the end
        return `/marketplace/sale-campaign?${getQueryString(
          {
            pageNumber: pageNumber ? pageNumber + 1 : 1,
            pageSize: 8,
            sortBy: "id",
            sortDirection: "DESC",
            name: searchValue,
          },
          []
        )}`; // SWR key
      },
    [searchValue]
  );

  const { data, size, setSize } = useSWRInfinite(
    getKey(),
    paginationFetcher<CampaignData>
  );

  const [scroll] = useWindowScroll();

  useEffect(() => {
    if (1.5 * scroll.y > window.screen.height * size) {
      setSize((prev) => prev + 1);
    }
  }, [scroll]);

  return (
    <div className="campaign-list-page md:mx-10">
      <div className="flex justify-between items-center">
        <div className="text-xl font-semibold">Tất cả chiến dịch của Arty</div>
        <div>
          <Input
            className="w-[300px]"
            icon={<IconSearch />}
            placeholder="Tìm kiếm chiến dịch..."
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />
        </div>
      </div>
      <div className={clsx("mt-6 grid grid-cols-1 md:!grid-cols-2 !gap-8")}>
        {data?.flat()?.length ? (
          data
            ?.flat()
            ?.map((campaign, index) => (
              <CampaignPreviewCard
                campaign={campaign}
                key={index}
                contentStyle="bg-black opacity-80 min-h-[96px]"
              />
            ))
        ) : (
          <NotFoundComponent
            title={notfoundMessages.NOT_FOUND_CAMPAIGNS}
            classNames={{
              root: "col-span-full",
            }}
          />
        )}
      </div>
    </div>
  );
}
