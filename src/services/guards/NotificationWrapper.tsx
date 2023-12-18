import { NotificationContext } from "@/contexts/NotificationContext";
import { $user } from "@/store/user";
import { NotificationType } from "@/types/Notification";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { errorHandler } from "@/utils/errorHandler";
import { useStore } from "@nanostores/react";
import { useEffect, useRef, useState } from "react";
// @ts-ignore
import * as io from "socket.io-client";
import axiosClient from "../backend/axiosClient";

export default function NotificationWrapper({ children }: any) {
  const user = useStore($user);
  const socket = useRef() as any;

  useEffect(() => {
    if (!socket.current && user?.id) {
      io(process.env.NEXT_PUBLIC_SOCKET_ENDPOINT, {
        path: `/socket.io`, // Specify the path if necessary
        transports: ["websocket"],
        query: {
          userId: user?.id,
        },
        reconnection: false,
      });

      socket.current?.on("connect", () => {
        if (user != null) {
          console.log("aa");
          getNotification();
        }
      });

      socket.current?.on("messages", (data: NotificationType) => {
        setIsHasNewNotification(true);
      });
    }

    return () => {
      socket.current?.close();
    };
  }, [user]);

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

  useEffect(() => {}, [user]);

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
