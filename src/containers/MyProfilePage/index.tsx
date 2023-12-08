import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import { User } from "@/types/User";
import { Button, Modal, Tabs } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import ArtistRegisterModal from "../ArtistRegisterModal";
import AccountTab from "../Tabs/AccountTab";
import OrderTab from "../Tabs/OrderTab";
import PostTab from "../Tabs/PostTab";

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
  {
    key: "posts",
    element: <PostTab />,
    title: "My Posts",
  },
];

export default function MyProfilePage({ user }: MyProfileProps) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div className="my-profile-page">
      <Modal opened={opened} onClose={close} title="Artist Registration">
        <ArtistRegisterModal closeModal={close} />
      </Modal>
      <div className="bg-white py-6 px-10 relative mt-[200px]">
        <div className="absolute -top-16">
          <ImageWithFallback
            fallback="/assets/default-thumbnail.jpg"
            className="rounded-full aspect-square "
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
                Be an artist
              </Button>
            )}
          </div>
        </div>
      </div>
      <Tabs defaultValue={user.role === "ARTIST" ? "posts" : "order"}>
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
