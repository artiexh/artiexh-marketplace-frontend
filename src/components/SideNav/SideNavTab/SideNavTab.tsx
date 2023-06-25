import { NavInfo } from "@/types/SideNav";
import Image from "next/image";

type Props = {
  isChosen: boolean;
  onClickTab: () => void;
} & NavInfo;

const SideNavTab = ({ label, iconPath, isChosen, onClickTab }: Props) => {
  return (
    <div
      className={`mt-0.5 cursor-pointer flex py-2.7 text-sm ease-nav-brand my-0 mx-4 items-center whitespace-nowrap px-4 py-2.5 transition-colors ${
        isChosen && "rounded-lg bg-white text-slate-700 font-semibold"
      } `}
      onClick={onClickTab}
    >
      <div
        className={`shadow-soft-2xl mr-3 flex h-8 w-8 items-center justify-center center rounded-lg bg-white xl:p-2.5 ${
          isChosen && "bg-gradient-to-tl from-purple-700 to-pink-500"
        }`}
      >
        <Image
          className={`filter ${
            !isChosen &&
            "brightness-0 saturate-100 invert(11%) sepia(13%) saturate(2254%) hue-rotate(178deg) brightness(94%) contrast(88%)"
          }`}
          src={iconPath}
          alt={label}
          width={12}
          height={12}
        />
      </div>
      <div>{label}</div>
    </div>
  );
};

export default SideNavTab;
