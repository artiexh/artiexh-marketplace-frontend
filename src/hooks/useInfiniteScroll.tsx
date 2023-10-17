import { paginationFetcher } from "@/services/backend/axiosClient";
import { useState } from "react";
import useSWRInfinite from "swr/infinite";

export function useInfiniteScroll<T>({
  endpoint,
  searchKeyName,
  searchKey,
}: {
  endpoint: string;
  searchKeyName: keyof T;
  searchKey?: string;
}) {
  function getKey<T>(pageNumber: number, previousPageData: T[]) {
    if (pageNumber && !previousPageData.length) return null; // reached the end
    return `/${endpoint}?pageNumber=${pageNumber + 1}&pageSize=10${
      searchKey ? `&${searchKeyName as string}=${searchKey}` : ""
    }`; // SWR key
  }

  const { data, setSize } = useSWRInfinite(getKey<T>, paginationFetcher<T>);
  const [loading, setLoading] = useState(false);

  console.log(data);

  const onScroll = async (event: any) => {
    const target = event.target;
    if (
      !loading &&
      target.scrollTop + target.offsetHeight === target.scrollHeight
    ) {
      setLoading(true);
      console.log("Load...");
      target.scrollTo(0, target.scrollHeight);
      setSize((size) => size + 1);
      setLoading(false);
    }
  };

  return {
    data,
    onScroll,
    loading,
  };
}
