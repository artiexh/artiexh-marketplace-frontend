import { createContext } from "react";

export const NotificationContext = createContext({
  isHasNewNotification: false,
  setIsHasNewNotification: (value: boolean) => {},
});
