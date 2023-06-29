import SideNav from "@/components/SideNav";
import {
  navContents,
  navSections,
} from "@/containers/ArtistDashboardPage/navSections";
import { useState } from "react";

const ArtistDashboardPage = () => {
  const [currentTabId, setCurrentTabId] = useState<string>("DASHBOARD");
  const [displaySideNav, setDisplaySideNav] = useState<boolean>(false);

  return (
    <div className="flex bg-[#F8F9FA]">
      <SideNav
        currentTabId={currentTabId}
        setCurrentTabId={setCurrentTabId}
        displaySideNav={displaySideNav}
        navSections={navSections}
      />
      <div className="ease-soft-in-out xl:ml-[17.125rem] relative h-full max-h-screen rounded-xl transition-all duration-200 ps ps--active-y w-full p-6">
        {navContents[currentTabId]}
      </div>
    </div>
  );
};

export default ArtistDashboardPage;
