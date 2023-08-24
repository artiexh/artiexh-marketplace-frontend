import { User } from "@/types/User";
import Image from "next/image";
import defaultImage from "../../../public/assets/default-thumbnail.jpg";
import { Divider, Tabs } from "@mantine/core";
import AccountTab from "../Tabs/AccountTab";
import OrderTab from "../Tabs/OrderTab";

type MyProfileProps = {
  user: User;
};

const tabs = [
  {
    key: "account",
    element: <AccountTab />,
    title: "Account",
  },
  {
    key: "order",
    element: <OrderTab />,
    title: "Order",
  },
];

export default function MyProfilePage({ user }: MyProfileProps) {
  return (
    <Tabs defaultValue="account" orientation="vertical">
      <div className="my-profile-page flex">
        <div className="w-[150px]">
          <div>
            <div className="flex justify-center">
              <Image
                className="rounded-full aspect-square"
                src={
                  user.avatarUrl?.includes("http")
                    ? user.avatarUrl
                    : defaultImage
                }
                alt="image"
                width={100}
              />
            </div>
            <div className="text-center font-bold text-xl mt-3">
              {user.displayName}
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
