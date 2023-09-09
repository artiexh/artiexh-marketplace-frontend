import { NOTIFICATION_TYPE, NOTIFICATION_TYPE_ENUM } from "@/constants/common";
import { CreateUserAddress, Address } from "@/types/User";
import {
  IconCircleCheckFilled,
  IconExclamationCircle,
} from "@tabler/icons-react";

export const fromUserAddressToDefaultAddressFormValue: (
  address: Address
) => CreateUserAddress = (address: Address) => {
  const { ward, ...data } = address;
  return {
    ...data,
    wardId: address.ward.id,
  };
};

export const getNotificationIcon = (type: NOTIFICATION_TYPE_ENUM) => {
  switch (type) {
    case NOTIFICATION_TYPE.SUCCESS:
      return {
        color: "green",
        icon: <IconCircleCheckFilled />,
      };
    case NOTIFICATION_TYPE.FAILED:
      return {
        color: "red",
        icon: <IconExclamationCircle />,
      };
  }
};
