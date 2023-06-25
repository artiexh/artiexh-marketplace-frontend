import clsx from "clsx";
import Image from "next/image";

export default function LogoCheckbox({
  isChecked = false,
  configClass,
  clickEvent,
}: {
  isChecked?: boolean;
  configClass?: string;
  clickEvent?: () => void;
}) {
  return (
    <div className={clsx(configClass, "logo-checkbox")} onClick={clickEvent}>
      {isChecked ? (
        <Image
          src="/assets/logo.svg"
          alt=""
          width={20}
          height={20}
          className="aspect-square bg-white rounded-full"
        />
      ) : (
        <div className="w-[20px] h-[20px] bg-white border-2 border-primary rounded-full"></div>
      )}
    </div>
  );
}
