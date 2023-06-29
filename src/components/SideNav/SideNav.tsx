import { NavSection } from "@/types/SideNav";
import SideNavTab from "./SideNavTab";
import { Dispatch, SetStateAction } from "react";
import clsx from "clsx";

interface ISideNavProps {
  navSections: NavSection[];
  displaySideNav: boolean;
  currentTabId: string;
  setCurrentTabId: Dispatch<SetStateAction<string>>;
}

const SideNav = ({
  navSections,
  displaySideNav,
  currentTabId,
  setCurrentTabId,
}: ISideNavProps) => {
  return (
    <div
      className={clsx(
        "max-w-[15.625rem] z-[990] fixed my-4 ml-4 w-full -translate-x-full overflow-y-auto rounded-2xl bg-white transition-transform duration-200 xl:left-0 xl:translate-x-0 xl:bg-transparent",
        displaySideNav && "translate-x-0 shadow-soft-xl"
      )}
    >
      {navSections.map((navSection) => (
        <div key={navSection.id}>
          <div className="pl-6 ml-2 font-bold leading-tight uppercase text-xs opacity-60 mt-4 mb-2">
            {navSection?.title}
          </div>
          {navSection.navList.map((nav) => (
            <SideNavTab
              key={nav.id}
              {...nav}
              isChosen={currentTabId === nav.id}
              onClickTab={() => setCurrentTabId(nav.id)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default SideNav;
