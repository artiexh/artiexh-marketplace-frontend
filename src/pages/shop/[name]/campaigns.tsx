import CampaignPreviewCard from "@/components/CampaignPreviewCard/CampaignPreviewCard";
import { paginationFetcher } from "@/services/backend/axiosClient";
import { CampaignData } from "@/types/Campaign";
import { Button, Drawer, Select } from "@mantine/core";
import { useDisclosure, useWindowScroll } from "@mantine/hooks";
import clsx from "clsx";
import { useEffect } from "react";
import useSWRInfinite from "swr/infinite";

export default function CampaignListPage() {
  function getKey(pageNumber: number, previousPageData: CampaignData[]) {
    if (pageNumber && !previousPageData.length) return null; // reached the end
    return `/marketplace/sale-campaign?pageNumber=${
      pageNumber + 1
    }&pageSize=8&sortBy=id&sortDirection=DESC`; // SWR key
  }

  const { data, size, setSize } = useSWRInfinite(
    getKey,
    paginationFetcher<CampaignData>
  );

  const [scroll] = useWindowScroll();

  useEffect(() => {
    console.log(scroll, size, window.screen.height);

    if (scroll.y > window.screen.height * size) {
      setSize((prev) => prev + 1);
    }
  }, [scroll]);

  return (
    <div className="campaign-list-page md:flex">
      <div className="w-[300px] hidden md:block">
        <div className="text-lg font-bold">Lọc theo</div>
        <div className="mt-6 mb-2 text-sm text-gray-500">Danh mục</div>
        <div className="text-sm">
          <div className="cursor-pointer">Tất cả</div>
          <div className="my-2 cursor-pointer">T-Shirt</div>
          <div className="cursor-pointer">Tote bag</div>
        </div>
      </div>
      <div className="md:hidden flex gap-2">
        <CategoryButton />
        <SortButton />
      </div>
      <div>
        <div className="items-center gap-2 justify-end hidden md:flex ">
          <div>Sắp xếp theo:</div>
          <div>
            <Select
              placeholder="Tiêu chí"
              data={["Tất cả", "Mới nhất", "Cũ nhất"]}
            />
          </div>
        </div>
        <div className={clsx("mt-6 grid grid-cols-1 md:!grid-cols-2 !gap-8")}>
          {data?.flat()?.map((campaign, index) => (
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

const SortButton = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const items = ["Tất cả", "Mới nhất", "Cũ nhất"];
  return (
    <>
      <Drawer opened={opened} onClose={close} position="bottom">
        <div className="mb-2">
          {items.map((item) => (
            <div key={item} className="ml-2 py-1">
              {item}
            </div>
          ))}
        </div>
      </Drawer>
      <Button
        onClick={open}
        className="bg-white border-1 border-black !text-black rounded-sm"
      >
        Sort
      </Button>
    </>
  );
};

const CategoryButton = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const items = ["Tất cả", "T-Shirt", "Tote bag"];
  return (
    <>
      <Drawer opened={opened} onClose={close} position="bottom">
        {items.map((item) => (
          <div key={item} className="ml-4 py-1">
            {item}
          </div>
        ))}
      </Drawer>
      <Button
        onClick={open}
        className="bg-white border-1 border-black !text-black rounded-sm flex-1"
      >
        Danh mục
      </Button>
    </>
  );
};
