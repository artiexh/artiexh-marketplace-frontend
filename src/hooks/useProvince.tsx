import { fetcher } from "@/services/backend/axiosClient";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { Province } from "@/types/User";
import useSwr from "swr";

const useProvinces = () => {
  const result = useSwr(["provinces"], () =>
    fetcher<CommonResponseBase<PaginationResponseBase<Province>>>(
      "/address/country/1/province"
    )
  );

  return result;
};

export default useProvinces;
