export const createQueryString = (
  searchParams: any,
  name: string,
  value: string
) => {
  const params = new URLSearchParams(searchParams);
  params.set(name, value);
  return params.toString();
};

export const deleteQueryString = (searchParams: any, name: string) => {
  const params = new URLSearchParams(searchParams);
  params.delete(name);

  return params.toString();
};
