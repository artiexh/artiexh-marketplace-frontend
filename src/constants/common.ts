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
