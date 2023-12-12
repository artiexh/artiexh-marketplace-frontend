import { NotificationContext } from "@/contexts/NotificationContext";
import { $user } from "@/store/user";
import { NotificationType } from "@/types/Notification";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { errorHandler } from "@/utils/errorHandler";
import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";
// @ts-ignore
import * as io from "socket.io-client";
import axiosClient from "../backend/axiosClient";

export default function NotificationWrapper({ children }: any) {
  const user = useStore($user);
  const socket = io("https://api.artiexh.space", {
    path: `/socket.io`, // Specify the path if necessary
    transports: ["websocket"],
    query: {
      userId: user?.id,
    },
  });

  const [isHasNewNotification, setIsHasNewNotification] = useState(false);

  const getNotification = async () => {
    try {
      const { data: notifications } = await axiosClient.get<
        CommonResponseBase<PaginationResponseBase<NotificationType>>
      >("/notification?sortBy=id&sortDirection=DESC");

      if (notifications.data.items.some((item) => !item.readAt)) {
        setIsHasNewNotification(true);
      }
    } catch (err) {
      // errorHandler(err);
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      if (user != null) {
        getNotification();
      }
    });

    socket.on("messages", (data: NotificationType) => {
      setIsHasNewNotification(true);
      console.log(data);
    });
    socket.on("disconnect", () => console.log("b"));

    socket.on("connect_error", (err: unknown) => {
      errorHandler(err);
    });
    socket.on("connect_failed", (err: unknown) => errorHandler(err));

    return () => {
      socket.close();
    };
  }, [user]);

  return (
    <div className="notification-wrapper">
      <NotificationContext.Provider
        value={{
          isHasNewNotification,
          setIsHasNewNotification,
        }}
      >
        {children}
      </NotificationContext.Provider>
    </div>
  );
}
