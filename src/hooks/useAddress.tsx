import axiosClient from "@/services/backend/axiosClient";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { UserAddress } from "@/types/User";
import useSWR from "swr";

const useAddress = () => {
  const { data: addresses, mutate } = useSWR<UserAddress[]>(
    "address",
    async () => {
      try {
        const { data } = (
          await axiosClient<
            CommonResponseBase<PaginationResponseBase<UserAddress>>
          >("/user/address")
        ).data;
        return data.items;
      } catch (e) {
        return [];
      }
    }
  );

  return {
    addresses,
    mutate,
  };
};

export default useAddress;
