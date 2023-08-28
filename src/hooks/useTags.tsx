import { fetcher } from "@/services/backend/axiosClient";
import { Tag } from "@/types/Product";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import useSwr from "swr";

const useTags = () => {
  const result = useSwr(["tags"], () =>
    fetcher<CommonResponseBase<PaginationResponseBase<Tag>>>("/tag")
  );

  return result;
};

export default useTags;
