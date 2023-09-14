"use client";

import SideNav from "@/components/SideNav";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { navSections } from "@/constants/ArtistShopDashboard/navSections";

export default function MyShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [displaySideNav, setDisplaySideNav] = useState<boolean>(false);

  return (
    <div className="flex bg-[#F8F9FA]">
      <SideNav
        displaySideNav={displaySideNav}
        navSections={navSections}
        isChosen={(data) =>
          !!(
            pathname === "/my-shop" ? navSections[0].navList[0].href : pathname
          )?.includes(data.href)
        }
        onClickNav={(data) => router.push(data.href)}
      />
      <div className="ease-soft-in-out xl:ml-[17.125rem] relative h-full rounded-xl transition-all duration-200 ps ps--active-y w-full p-6">
        {children}
      </div>
    </div>
  );
}
