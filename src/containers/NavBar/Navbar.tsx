import Image from "next/image";
import { Autocomplete } from "@mantine/core";
import { IconShoppingCart } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { ROUTE } from "@/constants/route";

type NavBarProps = {};

export default function NavBar(props: NavBarProps) {
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
        <div className="w-[70%]">
          <Autocomplete data={[]} />
        </div>
        <div className="right-header">
          <IconShoppingCart onClick={() => router.push(ROUTE.CART)} />
        </div>
      </div>
    </div>
  );
}
