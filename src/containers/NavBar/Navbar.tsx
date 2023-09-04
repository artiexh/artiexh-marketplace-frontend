import Image from "next/image";
import { Autocomplete, HoverCard } from "@mantine/core";
import { IconShoppingCart, IconUser } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { ROUTE } from "@/constants/route";
import { logout } from "@/services/backend/services/user";
import { useStore } from "@nanostores/react";
import { $user } from "@/store/user";

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
            <Image
              src="/assets/logo.svg"
              alt="logo"
              width={60}
              height={60}
              className="aspect-square bg-white rounded-full"
            />
          </div>
          <div className="text-3xl ml-3 font-bold text-[#50207D]">Artiexh</div>
        </div>
        <div className="w-[60%]">
          <Autocomplete data={[]} />
        </div>
        <div className="right-header flex">
          <IconShoppingCart
            className="mr-10 cursor-pointer"
            onClick={() => router.push(ROUTE.CART)}
          />
          {user != null ? (
            <HoverCard width={200}>
              <HoverCard.Target>
                <IconUser className="cursor-pointer" />
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <div
                  onClick={() => router.push(`${ROUTE.PROFILE}/me`)}
                  className="cursor-pointer"
                >
                  Account
                </div>
                <div
                  onClick={() => window.open(ROUTE.SHOP, "_blank")}
                  className="my-4 cursor-pointer"
                >
                  Shop
                </div>

                <div onClick={logout} className="cursor-pointer">
                  Logout
                </div>
              </HoverCard.Dropdown>
            </HoverCard>
          ) : (
            <div
              className="cursor-pointer"
              onClick={() => router.push(ROUTE.SIGN_IN)}
            >
              Sign in
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
