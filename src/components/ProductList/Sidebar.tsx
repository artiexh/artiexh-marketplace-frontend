import { MAX_CATEGORIES } from "@/constants/ProductList";
import { FilterProps } from "@/services/backend/types/Filter";
import { Category } from "@/types/Product";
import { Button, Divider, NumberInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import {
  IconArrowDown,
  IconArrowRight,
  IconArrowUp,
  IconFilter,
} from "@tabler/icons-react";
import { FC, useState } from "react";
import CategoryItem from "./CategoryItem";

type SidebarProps = {
  form: UseFormReturnType<Partial<FilterProps>>;
  categories: Category[];
  submitHandler: (filters?: Object) => void;
  resetHandler: () => void;
};

const Sidebar: FC<SidebarProps> = ({
  categories,
  form,
  submitHandler,
  resetHandler,
}) => {
  const { values: filters, getInputProps, setFieldValue } = form;
  const [moreCategories, setMoreCategories] = useState(false);

  return (
    <nav className="hidden lg:block sticky col-span-3 top-5 h-max">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-xl flex items-center gap-1">
          <IconFilter />
          Bộ lọc
        </h2>
        <Button variant="outline" size="xs" onClick={resetHandler}>
          Xóa tất cả
        </Button>
      </div>
      <Divider className="my-3" />
      <h3 className="font-bold text-lg">Khoảng giá</h3>
      <div className="flex mt-2 items-center justify-between">
        <NumberInput
          hideControls
          thousandsSeparator="."
          // classNames={{ input: 'rounded-sm' }}
          placeholder="100.000"
          {...getInputProps("minPrice")}
        />
        <span className="mx-2">
          <IconArrowRight />
        </span>
        <NumberInput
          hideControls
          thousandsSeparator=","
          // classNames={{ input: 'rounded-sm' }}
          placeholder="1.000.000"
          {...getInputProps("maxPrice")}
        />
      </div>
      {/* <Divider className="my-3" /> */}
      {/* <h3 className="font-bold text-lg">Đánh giá</h3>
      <div className="flex items-center gap-3">
        <Rating color="purple" {...getInputProps("averageRate")} />
        <span className="text-subtext text-sm">trở lên</span>
      </div> */}
      <Divider className="my-3" />
      <h3 className="font-bold text-lg">Danh mục</h3>
      <div className="flex flex-col gap-3 mt-3">
        {categories.slice(0, MAX_CATEGORIES).map((category, index) => (
          <CategoryItem
            key={category.id}
            category={category}
            active={filters.categoryId === category.id}
            setActiveCategory={(id) => setFieldValue("categoryId", id)}
          />
        ))}
        {moreCategories &&
          categories
            .slice(MAX_CATEGORIES)
            .map((category, i) => (
              <CategoryItem
                key={category.id}
                category={category}
                active={filters.categoryId === category.id}
                setActiveCategory={(id) => setFieldValue("categoryId", id)}
              />
            ))}
        {categories.length > 5 && (
          <div
            className="text-subtext cursor-pointer hover:text-primary"
            onClick={() => setMoreCategories(!moreCategories)}
          >
            {moreCategories ? (
              <span className="flex gap-1 items-center">
                Bớt <IconArrowUp />
              </span>
            ) : (
              <span className="flex gap-1 items-center">
                Thêm <IconArrowDown />
              </span>
            )}
          </div>
        )}
      </div>
      <Divider className="my-3" />
      {/* <h3 className="font-bold text-lg">Nơi bán</h3>
      <Checkbox.Group
        className="flex flex-col gap-3 mt-3"
        {...getInputProps("locations")}
      >
        {categories.slice(0, MAX_CATEGORIES).map((category, index) => (
          <Checkbox
            key={category.id}
            label={`Thành phố ${index + 1}`}
            value={category.id}
          />
        ))}
        {moreLocations &&
          categories
            .slice(MAX_CATEGORIES)
            .map((category, index) => (
              <Checkbox
                key={category.id}
                label={`Thành phố ${index + 1 + MAX_CATEGORIES}`}
                value={category.id}
                className="cursor-pointer"
              />
            ))}
        {categories.length > 5 && (
          <div
            className="text-subtext cursor-pointer hover:text-primary"
            onClick={() => setMoreLocations(!moreLocations)}
          >
            {moreLocations ? (
              <span className="flex gap-1 items-center">
                Bớt <IconArrowUp />
              </span>
            ) : (
              <span className="flex gap-1 items-center">
                Thêm <IconArrowDown />
              </span>
            )}
          </div>
        )}
      </Checkbox.Group> */}
      {/* <Divider className="my-3" /> */}
      <Button
        className="bg-primary w-full !text-white"
        onClick={() => submitHandler(filters)}
      >
        Apply
      </Button>
    </nav>
  );
};

export default Sidebar;
