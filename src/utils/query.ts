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
