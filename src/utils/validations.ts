import { CreateUserAddress, UserAddress } from "@/types/User";
import { FormValidateInput } from "@mantine/form/lib/types";

const phoneNumberRegex = /^(\+\d{1,3}\s?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

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
