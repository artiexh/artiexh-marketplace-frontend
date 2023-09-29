import { Button, Input, Select } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import clsx from "clsx";
import { useRouter } from "next/router";
import { MouseEventHandler, useState } from "react";

export default function CampaignsPage() {
  const [selectedProvider, setSelectedProvider] = useState(0);
  const router = useRouter();
  return (
    <div className="max-w-[1280px] mx-auto flex flex-col gap-y-4 h-screen justify-center">
      <div className="w-full flex justify-end">
        <Button
          className="text-black hover:text-white"
          onClick={() => router.push("/campaigns/create/1")}
          variant="default"
        >
          Pick product
        </Button>
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
            <Select
              placeholder="Product category"
              data={[
                { label: "Tote bag", value: "TOTE_BAG" },
                { label: "T-shirt", value: "T_SHIRT" },
              ]}
            />
          </div>
          <div className="provider-list grid grid-cols-3 gap-6">
            {[...new Array(6)].map((_, index) => (
              <div key={index} className="col-span-1 h-[12.5rem]">
                <ProviderCard
                  onClick={() => setSelectedProvider(index)}
                  className={
                    index === selectedProvider ? "border border-primary" : ""
                  }
                  provider={{
                    logo: "/assets/carue.png",
                    name: "Provider name",
                    rating: 5,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type Provider = {
  logo: string;
  name: string;
  rating: number;
};
function ProviderCard({
  provider,
  className,
  onClick,
}: {
  provider: Provider;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "rounded-md bg-white w-full h-full flex flex-col items-center justify-center gap-y-2.5",
        className
      )}
    >
      <img
        src={provider.logo}
        className="w-[6.25rem] aspect-square rounded-full"
      />
      <span className="text-lg font-semibold">{provider.name}</span>
    </div>
  );
}
