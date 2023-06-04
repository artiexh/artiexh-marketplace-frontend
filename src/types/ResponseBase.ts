export type CommonResponseBase<T> = {
  timestamp: number;
  status: number;
  error: string | null;
  message: string | null;
  path: string;
  data: T;
};

export type PaginationResponseBase<T> = {};
