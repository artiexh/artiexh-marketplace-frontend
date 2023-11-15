import { phoneNumberRegex } from "@/utils/validations";
import { FormValidateInput } from "@mantine/form/lib/types";

type MyProfileBody = {
  bankAccount?: string;
  bankName?: string;
  phone?: string;
  shopThumbnail: string | File | null;
  description?: string;
};

export const editShopValidation: FormValidateInput<Partial<MyProfileBody>> = {
  bankAccount: (value) => {
    if (value && value?.trim().length > 16)
      return "Số tài khoản ngân hàng không thể vượt quá 16 ký tự.";
    return null;
  },
  bankName: (value) => {
    if (value && value?.trim().length > 50)
      return "Tên ngân hàng không thể vượt quá 50 kí tự";
    return null;
  },
  phone: (phone) => {
    if (phone && phoneNumberRegex.test(phone.trim()))
      return "Invalid phone number";
    return null;
  },
  description: (value) => {
    if (value && value.trim().length > 300)
      return "Mô tả tài khoản không thể vượt quá 300 kí tự";
  },
};

export const editProfileValidation: FormValidateInput<{
  displayName?: string;
  email?: string;
  avatar?: string | File;
}> = {
  email: (value) => {
    if (value && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
      return "Email không hợp lệ";
    }
  },
  displayName: (value) => {
    if (value && value.trim().length > 300)
      return "Mô tả tài khoản không thể vượt quá 300 kí tự";
  },
};
