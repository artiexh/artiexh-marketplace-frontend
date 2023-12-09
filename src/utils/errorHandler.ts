import { ErrorCode, errorMessages } from "@/constants/serviceMessages";
import { notifications } from "@mantine/notifications";

import { AxiosError } from "axios";
import { getNotificationIcon } from "./mapper";
import { NOTIFICATION_TYPE } from "@/constants/common";
import { ValidationError } from "./error/ValidationError";

export const defaultErrorCode = "DEFAULT_ERROR";

export const errorHandler = (
  error: unknown,
  customMessages?: Record<string, { title: string; description: string }>
) => {
  let errorCode: ErrorCode = ErrorCode.INVALID_ARGUMENT;
  let message;
  if (error instanceof AxiosError) {
    errorCode = error.response?.data.code;
    message = error.response?.data.message;
  } else if (error instanceof ValidationError) {
    notifications.show({
      ...getNotificationIcon(NOTIFICATION_TYPE.FAILED),
      title: "Thông tin không phù hợp",
      message: error.message ?? "Vui lòng kiểm tra lại thông tin nhập vào!",
    });
    return;
  } else if (error instanceof Error) {
    notifications.show({
      ...getNotificationIcon(NOTIFICATION_TYPE.FAILED),
      title: "Có lỗi xảy ra!",
      message: "Có lỗi xảy ra! Vui lòng thử lại sau!",
    });
    return;
  } else {
    errorCode = error as ErrorCode;
  }
  const { title, description } = customMessages?.[errorCode] ||
    errorMessages[errorCode] || {
      title: "Có lỗi xảy ra!",
      description: "Có lỗi xảy ra! Vui lòng thử lại sau!",
    };

  notifications.show({
    ...getNotificationIcon(NOTIFICATION_TYPE.FAILED),
    title: title,
    message: message ?? description,
  });
};
