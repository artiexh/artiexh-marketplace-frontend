import { Tabs, Divider } from "@mantine/core";
import Image from "next/image";
import { $user } from "@/store/user";
import { useStore } from "@nanostores/react";
import defaultImage from "../../../public/assets/default-thumbnail.jpg";
import ShopOrderTab from "../../containers/Tabs/ShopOrderTab";
import ShopProductTab from "../../containers/Tabs/ShopProductTab";

const tabs = [
  {
    key: "product",
    element: <ShopProductTab />,
    title: "Your products",
  },
  {
    key: "order",
    element: <ShopOrderTab />,
    title: "Your order",
  },
];

export default function ShopPage() {
  const user = useStore($user);

  if (user == null) {
    return <div>You haven't created your shop! </div>;
  }

  return (
    <Tabs defaultValue="product" orientation="vertical">
      <div className="my-profile-page flex">
        <div className="w-[150px]">
          <div>
            <div className="flex justify-center">
              <Image
                className="rounded-full aspect-square"
                src={
                  user?.avatarUrl?.includes("http")
                    ? user?.avatarUrl
                    : defaultImage
                }
                alt="image"
                width={100}
              />
            </div>
            <div className="text-center font-bold text-xl mt-3">
              {user?.shopName}
            </div>
            <Divider className="h-[2px] my-3" />
            <Tabs.List>
              {tabs.map((tab) => (
                <Tabs.Tab
                  key={tab.key}
                  value={tab.key}
                  className="flex justify-center"
                >
                  {tab.title}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </div>
        </div>
        <div className="ml-20">
          {tabs.map((tab) => (
            <Tabs.Panel key={tab.key} value={tab.key}>
              {tab.element}
            </Tabs.Panel>
          ))}
        </div>
      </div>
    </Tabs>
  );
}
