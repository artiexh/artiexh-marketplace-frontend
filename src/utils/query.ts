export const createQueryFunc = (
  name: string,
  value: string,
  searchParams: URLSearchParams
) => {
  const params = new URLSearchParams(searchParams);

  // for (const [key, value] of params.entries()) {
  //   params.set()
  // }

  return params.toString();
};

export type PaginationQuery = {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
};

export const queryDefaultMapper = (query: any) => {
  const { pageNumber, pageSize, ...rest } = query;
  const clonedRes = {} as any;
  Object.keys(rest).forEach((item) => {
    if (rest[item] != null) {
      clonedRes[item] = rest[item];
    }
  });
  return {
    pageNumber: pageNumber?.toString() || "1",
    pageSize: pageSize?.toString() || "5",
    ...clonedRes,
  };
};
