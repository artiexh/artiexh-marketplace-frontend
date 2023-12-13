import CampaignPreviewCard from "@/components/CampaignPreviewCard/CampaignPreviewCard";
import { paginationFetcher } from "@/services/backend/axiosClient";
import { CampaignData } from "@/types/Campaign";
import { useWindowScroll } from "@mantine/hooks";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import useSWRInfinite from "swr/infinite";

export default function CampaignListPage() {
  const params = useSearchParams();
  const username = params?.get("name");

  function getKey(pageNumber: number, previousPageData: CampaignData[]) {
    if (pageNumber && !previousPageData.length) return null; // reached the end
    return `/marketplace/artist/${username}/sale-campaign?pageNumber=${
      pageNumber + 1
    }&pageSize=8&sortBy=id&sortDirection=DESC`; // SWR key
  }

  const { data, size, setSize } = useSWRInfinite(
    getKey,
    paginationFetcher<CampaignData>
  );

  const [scroll] = useWindowScroll();

  useEffect(() => {
    if (1.5 * scroll.y > window.screen.height * size) {
      setSize((prev) => prev + 1);
    }
  }, [scroll]);

  if (!data) {
    return <div>Không tìm thấy sản phẩm nào</div>;
  }

  return (
    <div className="campaign-list-page md:mx-10">
      <div className="text-xl font-semibold">
        Tất cả chiến dịch của artist {data.flat()?.[0]?.owner?.displayName}
      </div>
      <div className={clsx("mt-6 grid grid-cols-1 md:!grid-cols-2 !gap-8")}>
        {data?.flat()?.map((campaign, index) => (
          <CampaignPreviewCard
            campaign={campaign}
            key={index}
            contentStyle="bg-black opacity-80 min-h-[96px]"
          />
        ))}
      </div>
    </div>
  );
}
