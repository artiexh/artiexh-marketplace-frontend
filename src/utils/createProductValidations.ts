import { PRODUCT_STATUS } from "@/constants/common";
import { CreateProductValues } from "@/types/Product";
import { FormValidateInput } from "@mantine/form/lib/types";

export function validationHandler(valid: boolean, error: string) {
  return valid ? null : error;
}

export const createProductValidation: FormValidateInput<CreateProductValues> = {
  // general
  name: (name) => {
    if (name.trim().length === 0) return "Name is required";
    if (name.trim().length < 5) return "Name must be at least 5 characters";
    if (name.trim().length > 50)
      return "Name cannot be longer than 50 characters";
    return null;
  },
  categoryId: (categoryId) =>
    validationHandler(categoryId !== null, "Category is required"),
  price: {
    amount: (value) =>
      validationHandler(value > 0, "Price must be greater than 0"),
  },
  // attaches: (attaches) =>
  // 	mantineValidationHandler(attaches.length > 0, 'At least 1 image is required'),
  remainingQuantity: (remaining) => {
    if (typeof remaining === "string") return "Remaining quantity is required";
    if (remaining < 0) return "Remaining quantity must be at least 0";
    return null;
  },
  maxItemsPerOrder: (maxItems) => {
    if (typeof maxItems === "string") return "Max items per order is required";
    if (maxItems < 0) return "Max items per order must be at least 0";
    return null;
  },
  thumbnail: (thumbnail) => {
    if (!thumbnail) return "Thumbnail is required";
    return null;
  },
  weight: (weight) => {
    if (weight <= 0) return "Product weight must be greater than zero";
    return null;
  },
  // payment
  paymentMethods: (methods) =>
    validationHandler(
      methods.length > 0,
      "At least 1 payment method is required"
    ),
};

export const CURRENCIES = ["USD", "VND", "EUR", "YEN"];

export const DEFAULT_FORM_VALUES: CreateProductValues = {
  status: PRODUCT_STATUS.AVAILABLE,
  name: "",
  price: {
    amount: 1,
    unit: CURRENCIES[0],
  },
  categoryId: "1",
  description: "",
  type: "NORMAL",
  remainingQuantity: 0,
  publishDatetime: new Date(),
  deliveryType: "SHIP",
  maxItemsPerOrder: 0, // 0 = unlimited
  allowShipping: false,
  thumbnail: undefined,
  paymentMethods: [],
  tags: [],
  attaches: [],
  weight: 0,
};
