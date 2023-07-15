"use client";

import SideNav from "@/components/SideNav";
import { useState } from "react";
import { navSections } from "./navSections";

export default function MyShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [displaySideNav, setDisplaySideNav] = useState<boolean>(false);

  return (
    <div className="flex bg-[#F8F9FA]">
      <SideNav
        displaySideNav={displaySideNav}
        navSections={navSections}
        basePath="/my-shop"
      />
      <div className="ease-soft-in-out xl:ml-[17.125rem] relative h-full max-h-screen rounded-xl transition-all duration-200 ps ps--active-y w-full p-6">
        {children}
      </div>
    </div>
  );
}
