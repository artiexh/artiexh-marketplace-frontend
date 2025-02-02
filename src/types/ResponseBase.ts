export type CommonResponseBase<T> = {
  timestamp: number;
  status: number;
  error?: string;
  message?: string;
  path: string;
  data: T;
};

export type PaginationResponseBase<T> = {
  page: number;
  pageSize: number;
  totalSize: number;
  totalPage: number;
  items: T[];
};
