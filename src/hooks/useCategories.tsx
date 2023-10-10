import { fetcher } from "@/services/backend/axiosClient";
import { Category } from "@/types/Product";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import useSwr from "swr";

const useCategories = () => {
  const result = useSwr(["categories"], () =>
    fetcher<CommonResponseBase<PaginationResponseBase<Category>>>(
      "/category?pageSize=100"
    )
  );

  return result;
};

export default useCategories;
