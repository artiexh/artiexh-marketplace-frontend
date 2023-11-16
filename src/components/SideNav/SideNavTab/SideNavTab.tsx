import { NavInfo } from "@/types/SideNav";
import clsx from "clsx";

type Props = {
  isChosen: boolean;
  onClick: (data: NavInfo) => void;
  data: NavInfo;
};

const SideNavTab = ({ isChosen, onClick, data }: Props) => {
  return (
    <div
      className={clsx(
        "mt-0.5 cursor-pointer flex text-sm mx-4 items-center px-4 py-2.5",
        isChosen && "rounded-lg bg-white text-slate-700 font-semibold"
      )}
      onClick={() => onClick(data)}
    >
      <div
        className={clsx(
          "mr-3 flex h-8 w-8 items-center justify-center xl:p-2.5 text-black"
        )}
      >
        <span className={clsx(isChosen && "text-[#2C49E6]", "[&_svg]:w-4")}>
          {data.iconPath}
        </span>
      </div>
      <div className={clsx(isChosen && "text-[#2C49E6]")}>{data.label}</div>
    </div>
  );
};

export default SideNavTab;
