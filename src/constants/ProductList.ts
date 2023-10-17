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
  { value: "cost_asc", label: "Price low to high" },
  { value: "cost_desc", label: "Price high to low" },
  { value: "ratings_asc", label: "Ratings low to high" },
  { value: "ratings_desc", label: "Ratings high to low" },
];
