import DesignItemCard from "@/components/Cards/DesignItemCard/DesignItemCard";
import { getDesignItemsFromLocalStorage } from "@/utils/localStorage/designProduct";
import { Button, Input } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/router";
import useSWR from "swr";

export default function CampaignsPage() {
  const router = useRouter();
  const { data, isLoading } = useSWR(["product-design"], () => {
    const list = getDesignItemsFromLocalStorage();

    return list;
  });

  if (isLoading) return null;

  return (
    <div className="max-w-[1280px] mx-auto flex flex-col gap-y-4 h-screen justify-center">
      <div className="w-full flex ">
        <h1>Campaign 1</h1>
      </div>
      <div className="flex gap-x-11">
        <div className="provider-detail w-[500px] h-[680px] bg-white rounded-md"></div>
        <div className="provider-list-container flex flex-col flex-1 gap-y-6">
          <div className="search-section flex gap-x-2.5">
            <Input
              placeholder="kiếm cái nịt"
              icon={<IconSearch className="w-5" />}
              className="flex-1"
            />
          </div>
          <div className="provider-list flex flex-col">
            {data?.map((item, index) => (
              <div key={item.id} className="h-[200px]">
                <DesignItemCard
                  data={item}
                  actions={
                    <div className="w-full flex justify-between">
                      <Button
                        className="text-black hover:text-white"
                        onClick={() =>
                          router.push(
                            `/campaigns/create/1/design?itemId=${item.id}`
                          )
                        }
                      >
                        Edit
                      </Button>
                    </div>
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
