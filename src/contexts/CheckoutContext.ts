import { createContext } from "react";

export const CheckoutContext = createContext({
  selectedAddressId: "",
  setSelectedAddressId: (id: string) => {},
});
