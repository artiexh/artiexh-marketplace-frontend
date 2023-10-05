import { SimpleProductBase } from "@/types/ProductBase";
import clsx from "clsx";
import Image from "next/image";
import { MouseEventHandler } from "react";
import defaultImg from "../../../../public/assets/default-thumbnail.jpg";
import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";

type ProductBaseCardProps = {
  data: SimpleProductBase;
  onClick?: MouseEventHandler<HTMLDivElement>;
  classNames?: {
    root: string;
  };
};

export default function ProductBaseCard({
  data,
  onClick,
  classNames,
}: ProductBaseCardProps) {
  const thumbnail = data.attaches.find((attach) => attach.type === "THUMBNAIL");

  return (
    <div
      className={clsx(
        "bg-white rounded-2xl aspect-3/5 w-full cursor-pointer",
        classNames?.root
      )}
      onClick={onClick}
    >
      <div className="relative w-full aspect-square">
        <ImageWithFallback
          fallback="/assets/default-thumbnail.jpg"
          className="rounded-2xl rounded-bl-none object-cover"
          src={thumbnail?.url.includes("http") ? thumbnail.url : defaultImg}
          alt="dogtor"
          fill
          priority
          sizes="(max-width: 768px) 100vw,
          (max-width: 1200px) 50vw,
          33vw"
        />
      </div>
      <div className="p-2.5 sm:p-6 sm:text-xl md:p-4 md:text-xl">
        <div className="font-semibold">{data?.name}</div>
        {data?.category.name && (
          <div className="text-slate-400 text-base">{data.category.name}</div>
        )}
        <div className="text-right mt-2.5 md:mt-6 font-semibold"></div>
      </div>
    </div>
  );
}
