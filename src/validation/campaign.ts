import { FormValidateInput } from "@mantine/form/lib/types";

export const campaignValidation: FormValidateInput<{ name?: string }> = {
  name: (value) => {
    if (value && value?.trim().length > 50)
      return "Tên của chiến dịch không thể vượt quá 50 ký tự.";
    return null;
  },
};

export const campaignInfoValidation: FormValidateInput<{
  name: string;
  description?: string;
  type: "SHARE" | "PRIVATE";
  from?: Date;
  to?: Date;
}> = {
  name: (value) => {
    if (value.trim().length > 50)
      return "Tên của chiến dịch không thể vượt quá 50 ký tự.";
  },
  description: (value) => {
    if (value && value.trim().length > 300)
      return "Mô tả của chiến dịch không thể vượt quá 300 ký tự.";
  },
  from: (value, values) => {
    if (value && new Date(value).getTime() < new Date().getTime())
      return "Ngày bắt đầu chiến dịch phải lớn hơn hôm nay";
    if (
      value &&
      values.to &&
      new Date(value).getTime() > new Date(values.to).getTime()
    )
      return "Ngày bắt đầu chiến dịch phải diễn ra sau ngày kết thúc";
  },
  to: (value, values) => {
    if (
      value &&
      values.from &&
      new Date(value).getTime() < new Date(values.from).getTime()
    )
      return "Ngày bắt đầu chiến dịch phải diễn ra sau ngày kết thúc";
  },
};

