import { ATTACHMENT_TYPE_ENUM } from "@/constants/common";

export type Attaches = {
  id: string;
  url: string;
  type: ATTACHMENT_TYPE_ENUM;
  title: string;
  description?: string;
};
