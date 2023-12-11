import { readNotification } from "@/services/backend/services/notification";
import { NotificationType } from "@/types/Notification";
import { dateFormatter } from "@/utils/formatter";
import { getNotificationRedirectUrl } from "@/utils/mapper";
import { IconCheck } from "@tabler/icons-react";
import clsx from "clsx";
import { useRouter } from "next/router";

export default function NotificationCard({
  notification,
  mutate,
}: {
  notification: NotificationType;
  mutate: any;
}) {
  const markAsRead = async (id: string) => {
    const result = await readNotification(id);

    if (result) {
      mutate();
    }
  };

  const router = useRouter();

  return (
    <div className="flex my-4 items-center gap-4">
      <div
        className={clsx(
          "shadow p-4 cursor-pointer flex-1",
          !notification.readAt && "bg-[#f8f3fe]"
        )}
        onClick={() => {
          const url = getNotificationRedirectUrl(notification.referenceData);

          if (url) {
            router.push(url);
          }
        }}
      >
        <div className="flex justify-between items-center mb-3">
          <div className="font-semibold">{notification.title}</div>
          <div className="text-sm text-gray-600">
            {dateFormatter(notification.createdDate)}
          </div>
        </div>
        <div className="text-sm text-gray-600">{notification.content}</div>
      </div>
      {!notification.readAt ? (
        <div
          className="text-xs text-gray-600 cursor-pointer"
          onClick={() => markAsRead(notification.id)}
        >
          Đánh dấu đã đọc
        </div>
      ) : (
        <div className="flex justify-between">
          <IconCheck />
        </div>
      )}
    </div>
  );
}
