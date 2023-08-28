import { User } from "@/types/User";
import Image from "next/image";
import defaultImage from "../../../public/assets/default-thumbnail.jpg";
import { Button, Divider, Tabs } from "@mantine/core";
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
    title: "My Orders",
  },
];

export default function MyProfilePage({ user }: MyProfileProps) {
  console.log(user);
  return (
    <div className="my-profile-page">
      <div className="bg-white py-6 px-10 relative mt-[200px]">
        <div className="absolute -top-16">
          <Image
            className="rounded-full aspect-square "
            width={120}
            src={
              user.avatarUrl?.includes("http") ? user.avatarUrl : defaultImage
            }
            alt="image"
          />
        </div>
        <div className="flex ml-[150px] justify-between">
          <div>
            <div className="text-xl font-bold">{user.displayName}</div>
            <div>@{user.username}</div>
          </div>
          <div>
            <Button className="bg-primary">Be an artist</Button>
          </div>
        </div>
      </div>
      <Tabs defaultValue="order">
        <div className="bg-white mt-2 py-4 px-6 mb-6">
          <Tabs.List>
            {tabs.map((tab) => (
              <Tabs.Tab key={tab.key} value={tab.key}>
                {tab.title}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </div>
        <div>
          {tabs.map((tab) => (
            <Tabs.Panel key={tab.key} value={tab.key}>
              {tab.element}
            </Tabs.Panel>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
