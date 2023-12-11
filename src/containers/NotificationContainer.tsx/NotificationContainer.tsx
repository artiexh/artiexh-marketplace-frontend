import { NotificationContext } from "@/contexts/NotificationContext";
import axiosClient from "@/services/backend/axiosClient";
import { readNotification } from "@/services/backend/services/notification";
import { $user } from "@/store/user";
import { NotificationType } from "@/types/Notification";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { errorHandler } from "@/utils/errorHandler";
import { dateFormatter } from "@/utils/formatter";
import { HoverCard } from "@mantine/core";
import { useStore } from "@nanostores/react";
import { IconBell, IconCheck } from "@tabler/icons-react";
import clsx from "clsx";
import router from "next/router";
import { useContext } from "react";
import useSWR from "swr";

export default function NotificationContainer() {
  const { isHasNewNotification } = useContext(NotificationContext);
  const user = useStore($user);

  const { data: notifications, mutate } = useSWR(
    ["notifications", isHasNewNotification, user?.id],
    () =>
      axiosClient
        .get<CommonResponseBase<PaginationResponseBase<NotificationType>>>(
          "/notification?sortBy=id&sortDirection=DESC"
        )
        .then((res) => res?.data?.data?.items ?? [])
        .catch((err) => errorHandler(err))
  );

  const markAsRead = async (id: string) => {
    const result = await readNotification(id);

    if (result) {
      mutate();
    }
  };

  return (
    <div>
      <HoverCard onOpen={mutate}>
        <HoverCard.Target>
          <div className="w-6 relative cursor-pointer">
            <IconBell className="mr-10" />
            {isHasNewNotification && (
              <div className="bg-red-500 w-3 h-3 rounded-full flex justify-center items-center absolute top-0 right-0"></div>
            )}
          </div>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          {notifications?.map((item) => (
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
          <div
            className="mt-6 text-center cursor-pointer text-sm"
            onClick={() => router.push("/notifications")}
          >
            Xem tất cả
          </div>
        </HoverCard.Dropdown>
      </HoverCard>
    </div>
  );
}
