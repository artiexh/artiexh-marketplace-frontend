import CampaignPreviewCard from "@/components/CampaignPreviewCard/CampaignPreviewCard";
import { campaignData } from "@/constants/campaign";
import clsx from "clsx";
import productStyles from "@/styles/Products/ProductList.module.scss";
import { Button, Menu } from "@mantine/core";

export default function CampaignListPage() {
  return (
    <div className="campaign-list-page flex">
      <div className="w-[300px]">
        <div className="text-lg font-bold">Filter results</div>
        <div className="mt-6 mb-2 text-sm text-gray-500">CATEGORY</div>
        <div className="text-sm">
          <div className="cursor-pointer">All categories</div>
          <div className="my-2 cursor-pointer">T-Shirt</div>
          <div className="cursor-pointer">Tote bag</div>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 justify-end">
          <div>Sort by:</div>
          <div>
            <Menu width={200} shadow="md">
              <Menu.Target>
                <Button className="bg-black !text-white rounded-sm">
                  Toggle menu
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item className="!text-black">
                  Date (latest to oldest)
                </Menu.Item>
                <Menu.Item className="!text-black">
                  Date (oldest to latest)
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </div>
        <div
          className={clsx(
            productStyles["product-list-grid"],
            "mt-6 !grid-cols-2 !gap-8"
          )}
        >
          {campaignData?.map((campaign, index) => (
            <CampaignPreviewCard
              campaign={campaign}
              key={index}
              contentStyle="bg-black opacity-80"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
