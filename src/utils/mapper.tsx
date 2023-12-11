import {
  ATTACHMENT_TYPE,
  NOTIFICATION_TYPE,
  NOTIFICATION_TYPE_ENUM,
} from "@/constants/common";
import { CampaignData } from "@/types/Campaign";
import { Product } from "@/types/Product";
import { CommonResponseBase } from "@/types/ResponseBase";
import { CreateUserAddress, Address } from "@/types/User";
import {
  IconCircleCheckFilled,
  IconExclamationCircle,
} from "@tabler/icons-react";
import { AxiosResponse } from "axios";

export const fromUserAddressToDefaultAddressFormValue: (
  address: Address
) => CreateUserAddress = (address: Address) => {
  const { ward, ...data } = address;
  return {
    ...data,
    wardId: address?.ward?.id,
  };
};

export const getCampaignType = (campaign: Product["saleCampaign"]) => {
  const { from, to } = campaign;
  const today = Date.now();

  if (Date.parse(from) > today) {
    return "IN_COMING";
  } else if (Date.parse(from) < today && today < Date.parse(to)) {
    return "IN_GOING";
  } else {
    return "CLOSED";
  }
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

export const mapImageUrlToImageBody = (
  response: AxiosResponse<
    CommonResponseBase<{
      fileResponses: {
        presignedUrl: string;
        fileName: string;
      }[];
    }>,
    any
  >,
  type: any
) => {
  const fileResponse = response.data.data.fileResponses;

  return fileResponse.map((file, index) => ({
    description: "",
    title: "",
    type: type,
    url: file.presignedUrl,
  }));
};

export const getOrderStatusStylingClass = (status: string) => {
  switch (status) {
    case "PAYING":
      return "bg-blue-500";
    case "PREPARING":
      return "bg-cyan-500";
    case "SHIPPING":
      return "bg-yellow-100";
    case "COMPLETED":
      return "bg-green-500";
    case "CANCELED":
      return "bg-red-500";
    case "REFUNDED":
      return "bg-gray-500";
    default:
      return "bg-red-500";
  }
};

export const getNotificationRedirectUrl = (referenceData: {
  id: string;
  referenceEntity: string;
}) => {
  const { id, referenceEntity } = referenceData;
  switch (referenceEntity) {
    case "CAMPAIGN_SALE":
      return `/my-shop/sale-campaigns/${id}`;
    case "CAMPAIGN_REQUEST":
      return `/my-shop/campaigns/${id}`;
    case "ORDER":
      return `/my-profile/total-order/${id}`;
    case "CAMPAIGN_ORDER":
      return `/my-profile/order/${id}`;
    case "POST":
      return `/my-profile`;
    default:
      break;
  }
};
