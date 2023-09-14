import axiosClient from "@/services/backend/axiosClient";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { Address } from "@/types/User";
import useSWR from "swr";

const useAddress = () => {
  const { data: addresses, mutate } = useSWR<Address[]>("address", async () => {
    try {
      const { data } = (
        await axiosClient<CommonResponseBase<PaginationResponseBase<Address>>>(
          "/user/address"
        )
      ).data;
      return data.items;
    } catch (e) {
      return [];
    }
  });

  return {
    addresses,
    mutate,
  };
};

export default useAddress;
