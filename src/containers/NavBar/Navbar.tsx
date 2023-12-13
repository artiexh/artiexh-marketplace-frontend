/* eslint-disable @next/next/no-img-element */
import { ROUTE } from "@/constants/route";
import { logout } from "@/services/backend/services/user";
import { $user } from "@/store/user";
import { HoverCard } from "@mantine/core";
import { useStore } from "@nanostores/react";
import { IconShoppingCart } from "@tabler/icons-react";
import { useRouter } from "next/router";
import FetchAutoComplete from "../FetchAutocomplete/FetchAutocomplete";
import NotificationContainer from "../NotificationContainer.tsx/NotificationContainer";

type NavBarProps = {};

export default function NavBar(props: NavBarProps) {
  const user = useStore($user);

  const router = useRouter();
  return (
    <div className="navbar fixed py-4 left-0 top-0 bg-white w-full z-50">
      <div className="md:max-w-[90vw] mx-3 md:mx-auto flex items-center justify-between">
        <div
          className="left-header flex items-center cursor-pointer"
          onClick={() => router.push(ROUTE.HOME_PAGE)}
        >
          <div>
            <img
              src="/assets/logo.svg"
              alt="logo"
              className="aspect-square bg-white rounded-full w-8 h-8 sm:w-[60px] sm:h-[60px]"
            />
          </div>
          <div className="hidden sm:block text-3xl ml-3 font-bold text-[#50207D]">
            Arty
          </div>
        </div>
        <div className="w-[60%]">
          <FetchAutoComplete />
        </div>
        <div className="right-header flex items-center">
          <div className="mr-6">
            <div
              className="w-6 relative cursor-pointer"
              onClick={() => router.push(ROUTE.CART)}
            >
              <IconShoppingCart className="mr-10" />
              {Number(user?.cartItemCount) > 0 && (
                <div className="bg-red-500 w-3 h-3 rounded-full flex justify-center items-center absolute top-0 right-0">
                  <div className="text-[0.5rem] text-white">
                    {user?.cartItemCount}
                  </div>
                </div>
              )}
            </div>
          </div>
          {user != null && (
            <div className="mr-6">
              <NotificationContainer />
            </div>
          )}
          {user != null ? (
            <HoverCard width={200}>
              <HoverCard.Target>
                <img
                  src={user.avatarUrl ?? "/assets/default-thumbnail.jpg"}
                  alt="avatar"
                  className="w-[20px] h-[20px] rounded-full cursor-pointer object-cover"
                />
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <div
                  onClick={() => router.push(`${ROUTE.MY_PROFILE}`)}
                  className="cursor-pointer mb-4"
                >
                  Account
                </div>
                {user.role === "ARTIST" && (
                  <div
                    onClick={() => window.open(ROUTE.SHOP, "_blank")}
                    className="mb-4 cursor-pointer"
                  >
                    Shop
                  </div>
                )}

                <div
                  onClick={async () => {
                    await logout();
                    router.push(ROUTE.SIGN_IN);
                  }}
                  className="cursor-pointer"
                >
                  Logout
                </div>
              </HoverCard.Dropdown>
            </HoverCard>
          ) : (
            <div
              className="cursor-pointer"
              onClick={() => router.push(ROUTE.SIGN_IN)}
            >
              Đăng nhập
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
