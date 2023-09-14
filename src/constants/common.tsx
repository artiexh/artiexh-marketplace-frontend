import {
  IconCircleX,
  IconMoodCheck,
  IconMoodDollar,
  IconShoppingCart,
  IconTruckDelivery,
} from "@tabler/icons-react";

export const PRODUCT_STATUS = {
  DELETED: "DELETED",
  NOT_AVAILABLE: "NOT_AVAILABLE",
  PRE_ORDER: "PRE_ORDER",
  AVAILABLE: "AVAILABLE",
} as const;

export type PRODUCT_STATUS_ENUM = keyof typeof PRODUCT_STATUS;

export const PRODUCT_TYPE = {
  NORMAL: "NORMAL",
  MEMBER_ONLY: "MEMBER_ONLY",
};

export type PRODUCT_TYPE_ENUM = keyof typeof PRODUCT_TYPE;

export const DELIVERY_TYPE = {
  SHIP: "SHIP",
  AT_EVENT: "AT_EVENT",
};

export type DELIVERY_TYPE_ENUM = keyof typeof DELIVERY_TYPE;

export const ATTACHMENT_TYPE = {
  THUMBNAIL: "THUMBNAIL",
  OTHER: "OTHER",
} as const;

export type ATTACHMENT_TYPE_ENUM = keyof typeof ATTACHMENT_TYPE;

export const ADDRESS_TYPE = {
  HOME: "HOME",
  OFFICE: "OFFICE",
} as const;

export const PAYMENT_METHOD = {
  CASH: "CASH",
  VN_PAY: "VN_PAY",
} as const;

export type PAYMENT_METHOD_ENUM = keyof typeof PAYMENT_METHOD;

export const ORDER_STATUS = {
  PAYING: {
    code: "PAYING",
    name: "Đang thanh toán",
  },
  PREPARING: {
    code: "PREPARING",
    name: "Đang chuẩn bị",
  },
  SHIPPING: {
    code: "SHIPPING",
    name: "Đang vận chuyển",
  },
  COMPLETED: {
    code: "COMPLETED",
    name: "Hoàn thành",
  },
  CANCELLED: {
    code: "CANCELLED",
    name: "Đã hủy",
  },
} as const;

export type ORDER_STATUS_ENUM = keyof typeof ORDER_STATUS;

export const NOTIFICATION_TYPE = {
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
} as const;

export type NOTIFICATION_TYPE_ENUM = keyof typeof NOTIFICATION_TYPE;

export const ORDER_HISTORY_CONTENT_MAP: {
  [key: string]: { content: string; icon: JSX.Element };
} = {
  CREATED: {
    content: "Đơn hàng được tạo",
    icon: <IconShoppingCart size={12} />,
  },
  PAID: {
    content: "Đơn hàng đã được thanh toán",
    icon: <IconMoodDollar size={12} />,
  },
  SHIPPED: {
    content: "Đơn hàng đang được vận chuyển",
    icon: <IconTruckDelivery size={12} />,
  },
  DELIVERED: {
    content: "Đơn hàng đã được nhận",
    icon: <IconMoodCheck size={12} />,
  },
  CANCELLED: {
    content: "Đơn hàng đã bị hủy",
    icon: <IconCircleX size={12} />,
  },
};

export type ORDER_HISTORY_STATUS_ENUM = keyof typeof ORDER_HISTORY_CONTENT_MAP;
