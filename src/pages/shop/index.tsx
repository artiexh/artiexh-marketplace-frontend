import { Tabs, Divider, Collapse } from "@mantine/core";
import Image from "next/image";
import { $user } from "@/store/user";
import { useStore } from "@nanostores/react";
import defaultImage from "../../../public/assets/default-thumbnail.jpg";
import ShopOrderTab from "../../containers/Tabs/ShopOrderTab";
import ShopProductTab from "../../containers/Tabs/ShopProductTab";
import NestedTab from "@/components/NestedTab";
import CreateProductContainer from "@/containers/CreateProductContainer/CreateProductContainer";

const tabs = [
  {
    key: "product",
    element: <ShopProductTab />,
    title: "Products",
    subTabs: [
      {
        key: "my_product",
        element: <div>My product</div>,
        title: "My Products",
      },
      {
        key: "create_product",
        element: <CreateProductContainer />,
        title: "Create Product",
      },
    ],
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
      <div className="my-profile-page flex w-full">
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
                <>
                  {tab.subTabs ? (
                    <NestedTab tabs={tab.subTabs} parentTab={tab} />
                  ) : (
                    <Tabs.Tab
                      style={{
                        paddingLeft: 0,
                        fontSize: 16,
                      }}
                      key={tab.key}
                      value={tab.key}
                    >
                      {tab.title}
                    </Tabs.Tab>
                  )}
                </>
              ))}
            </Tabs.List>
          </div>
        </div>
        <div className="ml-20 w-full">
          {tabs.map((tab) => (
            <>
              <Tabs.Panel key={tab.key} value={tab.key}>
                {tab.element}
              </Tabs.Panel>
              {tab.subTabs?.map((subTab) => (
                <Tabs.Panel key={subTab.key} value={subTab.key}>
                  {subTab.element}
                </Tabs.Panel>
              ))}
            </>
          ))}
        </div>
      </div>
    </Tabs>
  );
}
