import CampaignPreviewCard from "@/components/CampaignPreviewCard/CampaignPreviewCard";
import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import NotFoundComponent from "@/components/NotFoundComponents/NotFoundComponent";
import { notfoundMessages } from "@/constants/notfoundMesssages";
import axiosClient, { paginationFetcher } from "@/services/backend/axiosClient";
import { CampaignData } from "@/types/Campaign";
import { CommonResponseBase } from "@/types/ResponseBase";
import { User } from "@/types/User";
import { useWindowScroll } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
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

  const router = useRouter();

  const { data: artist } = useQuery({
    queryKey: [username],
    queryFn: async () => {
      const { data } = await axiosClient.get<CommonResponseBase<User>>(
        `/artist/${username}`
      );

      return data.data;
    },
  });

  const [scroll] = useWindowScroll();

  useEffect(() => {
    if (1.5 * scroll.y > window.screen.height * size) {
      setSize((prev) => prev + 1);
    }
  }, [scroll]);

  return (
    <>
      {artist ? (
        <div
          className="cursor-pointer md:mx-10"
          onClick={() => router.push(`/shop/${artist.username}/home`)}
        >
          <ImageWithFallback
            className="w-full h-[200px] object-cover"
            src={
              artist.shopThumbnailUrl ??
              "https://i.pinimg.com/originals/ee/26/8c/ee268cf73e3850486966244fe34605d6.png"
            }
            alt="img"
            width={200}
            height={150}
          />
          <div className="md:top-0 flex gap-6 items-center px-6 py-4 bg-white shadow">
            <div>
              <ImageWithFallback
                src={artist.avatarUrl}
                className="w-[120px] h-[120px] object-cover rounded-full mx-auto"
                alt="img"
                width={120}
                height={120}
              />
            </div>
            <div>
              <div className="font-bold text-xl">{artist.displayName}</div>
            </div>
          </div>
        </div>
      ) : null}
      <div className="campaign-list-page mt-10 md:mx-10">
        <div className="text-xl font-semibold">
          Tất cả chiến dịch của {artist?.displayName}
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
    </>
  );
}
