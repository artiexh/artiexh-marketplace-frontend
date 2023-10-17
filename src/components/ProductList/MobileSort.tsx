import { Button, Divider } from "@mantine/core";
import clsx from "clsx";
import { FC, useState } from "react";

type MobileSortProps = {
  options: { label: string; value: string }[];
  onSort: (value: string | null) => void;
};

const MobileSort: FC<MobileSortProps> = ({ options, onSort }) => {
  const [selected, setSelected] = useState(options[0].value);

  return (
    <div
      className="bg-white rounded-t-lg absolute bottom-0 left-0 w-full"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-center py-3">Sắp xếp</h3>
      <Divider />
      <div className="px-5">
        {options.map((option) => (
          <div
            key={option.value}
            className={clsx(
              "py-3 text-subtext hover:text-black cursor-pointer",
              selected === option.value && "text-black font-bold"
            )}
            onClick={() => setSelected(option.value)}
          >
            {option.label}
          </div>
        ))}
      </div>
      <Divider />
      <div className="px-5 py-3">
        <Button
          className="bg-primary w-full h-10"
          onClick={() => onSort(selected)}
        >
          Áp dụng
        </Button>
      </div>
    </div>
  );
};

export default MobileSort;
