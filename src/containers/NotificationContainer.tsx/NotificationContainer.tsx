import { NotificationContext } from "@/contexts/NotificationContext";
import axiosClient from "@/services/backend/axiosClient";
import { $user } from "@/store/user";
import { NotificationType } from "@/types/Notification";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { HoverCard } from "@mantine/core";
import { useStore } from "@nanostores/react";
import { IconBell } from "@tabler/icons-react";
import router from "next/router";
import { useContext } from "react";
import useSWR from "swr";
import NotificationCard from "../NotificationCard/NotificationCard";

export default function NotificationContainer() {
  const { isHasNewNotification, setIsHasNewNotification } =
    useContext(NotificationContext);
  const user = useStore($user);

  const { data: notifications, mutate } = useSWR(
    ["notifications", isHasNewNotification, user?.id],
    () =>
      axiosClient
        .get<
          CommonResponseBase<
            PaginationResponseBase<NotificationType> & {
              unreadCount: number;
            }
          >
        >("/notification?sortBy=id&sortDirection=DESC")
        .then((res) => res?.data?.data)
  );

  if (notifications?.unreadCount === 0) {
    setIsHasNewNotification(false);
  }

  return (
    <div>
      <HoverCard onOpen={mutate}>
        <HoverCard.Target>
          <div className="w-6 relative cursor-pointer">
            <IconBell className="mr-10" />
            {notifications?.unreadCount ? (
              <div className="bg-red-500 w-3 h-3 rounded-full flex justify-center items-center absolute top-0 right-0"></div>
            ) : null}
          </div>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <div>
            {notifications?.items.map((item) => (
              <NotificationCard
                key={item.id}
                notification={item}
                mutate={mutate}
              />
            ))}
          </div>
          {notifications?.items.length ? (
            <div
              className="text-center cursor-pointer text-sm"
              onClick={() => router.push("/notifications")}
            >
              Xem tất cả
            </div>
          ) : (
            <div className="text-sm text-center">
              Hiện chưa có thông báo nào
            </div>
          )}
        </HoverCard.Dropdown>
      </HoverCard>
    </div>
  );
}
