import { logout } from "@/services/backend/services/user";
import { NavInfo, NavSection } from "@/types/SideNav";
import { getNotificationIcon } from "@/utils/mapper";
import { Divider } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconLogout } from "@tabler/icons-react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import SideNavTab from "./SideNavTab";
import ImageWithFallback from "../ImageWithFallback/ImageWithFallback";
import { $user } from "@/store/user";
import NotificationContainer from "@/containers/NotificationContainer.tsx/NotificationContainer";

interface ISideNavProps {
  navSections: NavSection[];
  displaySideNav: boolean;
  onClickNav: (data: NavInfo) => void;
  isChosen: (data: NavInfo) => boolean;
}

const SideNav = ({
  navSections,
  displaySideNav,
  onClickNav,
  isChosen,
}: ISideNavProps) => {
  const router = useRouter();
  const user = $user.get();

  const logoutFunc = async () => {
    const result = await logout();

    if (result) {
      router.push("/auth/signin");
    } else {
      notifications.show({
        message: "Logout failed",
        ...getNotificationIcon("FAILED"),
      });
    }
  };

  return (
    <>
      <div className="flex justify-end px-4 z-50 mt-6 mx-4">
        <NotificationContainer />
      </div>
      <div
        className={clsx(
          "max-w-[15.625rem] h-screen fixed py-4 w-full -translate-x-full overflow-y-auto !bg-white shadow transition-transform duration-200 xl:left-0 xl:translate-x-0 xl:bg-transparent",
          displaySideNav && "translate-x-0 shadow-soft-xl"
        )}
      >
        <div className="mt-10">
          {navSections.map((navSection) => (
            <div key={navSection.id}>
              <div className="pl-6 ml-2 font-bold leading-tight uppercase text-xs opacity-60 mt-4 mb-2">
                {navSection?.title}
              </div>
              {navSection.navList.map((nav) => (
                <SideNavTab
                  data={nav}
                  isChosen={isChosen(nav)}
                  onClick={() => onClickNav(nav)}
                  key={nav.id}
                />
              ))}
            </div>
          ))}
          <div className="mx-4 px-4 bottom-[60px] w-[calc(100%-32px)] absolute">
            <Divider className="mb-4" />
            <div className="flex justify-between">
              <div className="flex gap-4 items-center">
                <div>
                  <ImageWithFallback
                    src={user?.avatarUrl}
                    className="rounded-full w-[50px] aspect-square"
                  />
                </div>
                <div>{user?.displayName}</div>
              </div>
              <div
                className="mt-0.5 cursor-pointer flex text-sm items-center"
                onClick={logoutFunc}
              >
                <span className="[&_svg]:w-4 ">
                  <IconLogout className="ml-2 mr-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideNav;
