import { Divider } from "@mantine/core";
import { FC, useState } from "react";

type DescriptionProps = {
  description?: string;
};

const Description: FC<DescriptionProps> = ({ description }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="description-wrapper flex-1 card order-1 md:order-none col-span-12 md:col-span-7 p-0">
      <div className="px-5 pt-5 transition-all duration-500">
        <div>
          {description
            ? showMore
              ? description
              : description?.slice(0, 300)
            : "N/A"}
        </div>
      </div>

      {description?.length && description?.length > 300 ? (
        <>
          <Divider className="my-2" />
          <p
            className="text-center pb-2 cursor-pointer"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "Show less" : "Show more"}
          </p>
        </>
      ) : null}
    </div>
  );
};

export default Description;
