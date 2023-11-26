/* eslint-disable @next/next/no-img-element */
import { CampaignData } from "@/types/Campaign";
import { getCampaignTime } from "@/utils/date";
import clsx from "clsx";
import Timer from "../Timer/Timer";
import styles from "./CampaignPreviewCard.module.scss";
import { useRouter } from "next/router";
import { getCampaignType } from "@/utils/mapper";
import { CAMPAIGN_TYPE_DATA } from "@/constants/campaign";
import ImageWithFallback from "../ImageWithFallback/ImageWithFallback";

export default function CampaignPreviewCard({
  campaign,
  contentStyle,
}: {
  campaign: CampaignData;
  contentStyle?: string;
}) {
  const router = useRouter();
  const campaignType = getCampaignType(campaign);
  const campaignTime = getCampaignTime(
    campaign.from,
    campaign.to,
    getCampaignType(campaign)
  );
  const campaignTypeData = CAMPAIGN_TYPE_DATA[campaignType];

  return (
    <div
      className={clsx(styles["campaign-preview-card"], "cursor-pointer")}
      onClick={() => router.push(`/campaigns/${campaign.id}`)}
    >
      <div
        className={clsx(
          "content relative border-[6px] rounded-lg",
          campaignTypeData.borderStyle
        )}
      >
        <div
          className={clsx(
            "absolute left-0 top-0 z-10 pl-2 pr-4 pb-2 rounded-br-lg font-semibold",
            campaignTypeData.textStyle
          )}
        >
          {campaignTypeData.title}
        </div>
        <ImageWithFallback
          src={campaign.thumbnailUrl}
          // src="https://images.augustman.com/wp-content/uploads/sites/2/2023/04/26131013/dragon-bll.jpeg"
          alt="dogtor"
          className="!w-full object-cover !h-[250px] !md:h-[300px] brightness-75"
          width={200}
          height={200}
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
              {campaignType === "IN_GOING" && (
                <div className="text-xs mt-2">Đã bán: 10000+</div>
              )}
            </div>
            {campaignTime && (
              <div className="pt-3 py-4 px-3">
                <div className="text-white text-center">Chỉ còn:</div>
                <Timer initValue={campaignTime} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
