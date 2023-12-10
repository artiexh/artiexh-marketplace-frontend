import { FilterProps } from "@/services/backend/types/Filter";

export const MAX_CATEGORIES = 5;

export const DEFAULT_FILTERS: Partial<FilterProps> = {
  minPrice: undefined,
  maxPrice: undefined,
  averageRate: undefined,
  categoryId: undefined,
  // locations: [],
};

export const SORT_OPTIONS = [
  { value: "price.amount_ASC", label: "Giá từ thấp đến cao" },
  { value: "price.amount_DESC", label: "Giá từ cao đến thấp" },
  {
    value: "price_DEFAULT",
    label: "Mặc định",
  },
];
