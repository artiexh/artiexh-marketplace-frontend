export type FilterProps = {
  categoryId: string;
  minPrice: number;
  maxPrice: number;
  averageRate: number;
  locations: number[]; // Temp: no way to make this work with JSONSERVER, i dont want to code BE
};

export type PaginationProps = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: "ASC" | "DESC";
};
