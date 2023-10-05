import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import { NavInfo } from "@/types/SideNav";
import clsx from "clsx";
import Image from "next/image";

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
          "mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white xl:p-2.5",
          isChosen && "bg-gradient-to-tl from-purple-700 to-pink-500"
        )}
      >
        <Image
          className={clsx(
            "filter",
            !isChosen &&
              "brightness-0 saturate-100 invert(11%) sepia(13%) saturate(2254%) hue-rotate(178deg) brightness(94%) contrast(88%)"
          )}
          src={`/assets/icons/${data.iconPath}`}
          alt={data.label}
          width={12}
          height={12}
        />
      </div>
      <div>{data.label}</div>
    </div>
  );
};

export default SideNavTab;
