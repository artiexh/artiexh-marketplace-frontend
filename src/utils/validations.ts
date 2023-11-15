import { ArtistRegisterData, CreateUserAddress, Address } from "@/types/User";
import { FormValidateInput } from "@mantine/form/lib/types";

export const phoneNumberRegex =
  /^(\+\d{1,3}\s?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

export const createUpdateAddressValidation: FormValidateInput<CreateUserAddress> =
  {
    address: (address) => {
      if (address.trim().length === 0) return "Address is required";
      return null;
    },
    phone: (phone) => {
      if (!phoneNumberRegex.test(phone.trim())) return "Invalid phone number";
      if (phone.trim().length === 0) return "Phone is required";
      return null;
    },
    receiverName: (receiverName) => {
      if (receiverName.trim().length === 0) return "Receiver name is required";
      return null;
    },
    type: (type) => {
      if (type.trim().length === 0) return "Type is required";
      return null;
    },
    wardId: (wardId) => {
      if (wardId.trim().length === 0) return "Ward is required";
      return null;
    },
  };

export const artistRegisterValidation: FormValidateInput<ArtistRegisterData> = {
  shopAddress: (shopAddress) => {
    if (shopAddress.trim().length === 0) return "Address is required";
    return null;
  },
  shopPhone: (shopPhone) => {
    if (!phoneNumberRegex.test(shopPhone.trim())) return "Invalid phone number";
    if (shopPhone.trim().length === 0) return "Phone is required";
    return null;
  },
  shopName: (shopName) => {
    if (shopName.trim().length === 0) return "Shop name is required";
    return null;
  },
  shopWardId: (shopWardId) => {
    if (shopWardId.trim().length === 0) return "Ward is required";
    return null;
  },
};
