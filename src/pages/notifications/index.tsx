import NotificationCard from "@/containers/NotificationCard/NotificationCard";
import { paginationFetcher } from "@/services/backend/axiosClient";
import { NotificationType } from "@/types/Notification";
import { useWindowScroll } from "@mantine/hooks";
import { useEffect } from "react";
import useSWRInfinite from "swr/infinite";

function getKey(pageNumber: number, previousPageData: NotificationType[]) {
  if (pageNumber && !previousPageData.length) return null; // reached the end
  return `/notification?pageNumber=${
    pageNumber + 1
  }&pageSize=8&sortBy=id&sortDirection=DESC`; // SWR key
}

export default function NotificationPage() {
  const { data, size, setSize, mutate } = useSWRInfinite(
    getKey,
    paginationFetcher<NotificationType>
  );

  const [scroll] = useWindowScroll();

  useEffect(() => {
    if (10 * scroll.y > window.screen.height * size) {
      setSize((prev) => prev + 1);
    }
  }, [scroll]);

  return (
    <div className="mx-10">
      {data?.flat()?.map((item) => (
        <NotificationCard key={item.id} notification={item} mutate={mutate} />
      ))}
    </div>
  );
}
