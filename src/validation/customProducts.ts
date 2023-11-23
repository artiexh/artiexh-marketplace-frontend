import { UpdateGeneralInfoData } from "@/containers/CreateProductContainer/CustomProductDetailContainer";
import { FormValidateInput } from "@mantine/form/lib/types";

export const customProductValidation: FormValidateInput<UpdateGeneralInfoData> =
  {
    description: (value) => {
      if (value != null && value.trim().length >= 300)
        return "Mô tả quá dài. Vui lòng nhập mô tả ngắn hơn 300 ký tự";
      if (value != null && value.trim().length === 0)
        return "Vui lòng điền mô tả của sản phẩm";
      return null;
    },
    name: (value) => {
      if (value != null && value.trim().length === 0)
        return "Vui lòng điền tên của sản phẩm";
      if (value != null && value.trim().length > 30)
        return "Tên của sản phẩm không thể vượt quá 30 ký tự.";
      return null;
    },
    tags: (value) => {
      if (value.length > 5) return "Mỗi sản phẩm chỉ có thể có tối đa 5 tags";
      return null;
    },
  };
