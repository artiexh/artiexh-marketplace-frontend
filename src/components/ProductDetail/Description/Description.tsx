import { Divider } from "@mantine/core";
import clsx from "clsx";
import { FC, useState } from "react";

type DescriptionProps = {
  description?: string;
};

const Description: FC<DescriptionProps> = ({ description }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="description-wrapper flex-1 card order-1 md:order-none col-span-12 md:col-span-7 p-0">
      <div className="px-5 pt-5 transition-all duration-500">
        <h3 className="text-2xl font-bold">Description</h3>
        <p className="mt-1">{description}</p>
      </div>
      <div className={clsx("px-5", showMore ? "block" : "hidden")}>
        <div className="h-96 w-full gradient my-5"></div>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis
          voluptates earum maxime obcaecati quis, dolorum veniam iure,
          consequatur est magni commodi esse maiores! Corrupti nam excepturi
          facilis. Corrupti, sapiente quaerat!
        </p>
      </div>
      <Divider className="my-2" />
      <p
        className="text-center pb-2 cursor-pointer"
        onClick={() => setShowMore(!showMore)}
      >
        {showMore ? "Show less" : "Show more"}
      </p>
    </div>
  );
};

export default Description;
