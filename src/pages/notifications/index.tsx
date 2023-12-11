import { paginationFetcher } from "@/services/backend/axiosClient";
import { readNotification } from "@/services/backend/services/notification";
import { NotificationType } from "@/types/Notification";
import { dateFormatter } from "@/utils/formatter";
import { useWindowScroll } from "@mantine/hooks";
import { IconCheck } from "@tabler/icons-react";
import clsx from "clsx";
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
    if (1.5 * scroll.y > window.screen.height * size) {
      setSize((prev) => prev + 1);
    }
  }, [scroll]);

  const markAsRead = async (id: string) => {
    const result = await readNotification(id);

    if (result) {
      mutate();
    }
  };

  return (
    <div className="mx-10">
      {data?.flat()?.map((item) => (
        <div key={item.id} className="flex my-4 items-center gap-4">
          <div
            className={clsx(
              "shadow p-4 cursor-pointer flex-1",
              !item.readAt && "bg-[#f8f3fe]"
            )}
          >
            <div className="flex justify-between items-center mb-3">
              <div className="font-semibold">{item.title}</div>
              <div className="text-sm text-gray-600">
                {dateFormatter(item.createdDate)}
              </div>
            </div>
            <div className="text-sm text-gray-600">{item.content}</div>
          </div>
          {!item.readAt ? (
            <div
              className="text-xs text-gray-600 cursor-pointer"
              onClick={() => markAsRead(item.id)}
            >
              Đánh dấu đã đọc
            </div>
          ) : (
            <div className="flex justify-between">
              <IconCheck />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
