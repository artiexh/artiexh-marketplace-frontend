/* eslint-disable @next/next/no-img-element */
import { CampaignData } from "@/types/Campaign";
import { timeDiffFromNow } from "@/utils/date";
import clsx from "clsx";
import Timer from "../Timer/Timer";
import styles from "./CampaignPreviewCard.module.scss";
import { useRouter } from "next/router";

export default function CampaignPreviewCard({
  campaign,
  contentStyle,
}: {
  campaign: CampaignData;
  contentStyle?: string;
}) {
  const router = useRouter();

  return (
    <div
      className={clsx(styles["campaign-preview-card"], "cursor-pointer")}
      onClick={() => router.push(`/campaigns/${campaign.id}`)}
    >
      <div className="relative">
        <img
          // src={campaign.thumbnailUrl}
          src="https://images.augustman.com/wp-content/uploads/sites/2/2023/04/26131013/dragon-bll.jpeg"
          alt="dogtor"
          className="w-full object-cover h-[250px] md:h-[300px] brightness-75"
        />
        <div
          className={clsx("absolute w-full px-2 py-2 bottom-0", contentStyle)}
        >
          <div className="flex items-center ">
            <div className="flex-1 pt-3 text-white pl-3">
              <div className="font-bold two-line">{campaign.name}</div>
              <div className="text-xs two-line">
                Từ: {new Date(campaign.from).toLocaleDateString()} đến{" "}
                {new Date(campaign.to).toLocaleDateString()}
              </div>
              <div className="text-xs mt-2">Đã bán: 10000+</div>
            </div>
            <div className="pt-3 py-4 px-3">
              <div className="text-white text-center">Chỉ còn:</div>
              <Timer initValue={timeDiffFromNow(campaign.to)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
