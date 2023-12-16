import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import { User } from "@/types/User";
import { Button, Modal, Tabs } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import ArtistRegisterModal from "../ArtistRegisterModal";
import AccountTab from "../Tabs/AccountTab";
import OrderTab from "../Tabs/OrderTab";
import PostTab from "../Tabs/PostTab";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";

type MyProfileProps = {
  user: User;
};

const tabs = [
  {
    key: "order",
    element: <OrderTab />,
    title: "Đơn hàng",
  },
  {
    key: "posts",
    element: <PostTab />,
    title: "Bài viết",
  },
  {
    key: "account",
    element: <AccountTab />,
    title: "Tài khoản",
  },
];

export default function MyProfilePage({ user }: MyProfileProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const queryClient = useQueryClient();

  return (
    <div className="my-profile-page">
      <Modal opened={opened} onClose={close} title="Artist Registration">
        <QueryClientProvider client={queryClient}>
          <ArtistRegisterModal closeModal={close} />
        </QueryClientProvider>
      </Modal>
      <div className="bg-white py-6 px-10 relative mt-[200px]">
        <div className="absolute -top-16">
          <ImageWithFallback
            fallback="/assets/default-thumbnail.jpg"
            className="rounded-full aspect-square object-cover"
            width={120}
            height={120}
            src={
              user.avatarUrl?.includes("http")
                ? user.avatarUrl
                : "/assets/default-thumbnail.jpg"
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
            {user.role !== "ARTIST" && (
              <Button className="bg-primary !text-white" onClick={open}>
                Trở thành artist
              </Button>
            )}
          </div>
        </div>
      </div>
      <Tabs
        defaultValue={user.role === "ARTIST" ? "posts" : "order"}
        keepMounted={false}
      >
        <div className="bg-white mt-2 py-4 px-6 mb-6">
          <Tabs.List>
            {(user.role !== "ARTIST"
              ? tabs.filter((tab) => tab.key !== "posts")
              : tabs
            ).map((tab) => (
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
