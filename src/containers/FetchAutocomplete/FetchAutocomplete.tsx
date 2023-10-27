import axiosClient from "@/services/backend/axiosClient";
import { Product } from "@/types/Product";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { Autocomplete } from "@mantine/core";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";

export default function FetchAutoComplete() {
  const [searchKey, setSearchKey] = useState<string>("");
  const router = useRouter();
  const { data } = useSWR([searchKey], async () => {
    try {
      const result = await axiosClient.get<
        CommonResponseBase<PaginationResponseBase<Product>>
      >(`/product?keyword=${searchKey}&pageSize=8`);

      return result.data.data.items;
    } catch (e) {
      console.log(e);
    }
  });

  console.log(data);

  return (
    <div className="fetch-autocomplete">
      <Autocomplete
        value={searchKey}
        onChange={(value) => setSearchKey(value)}
        placeholder="Find your favorite product..."
        data={
          data?.map((item) => ({
            value: item.id,
            label: item.name,
          })) ?? []
        }
        onOptionSubmit={(value) => {
          router.push(`/product/${value}`);
          setSearchKey("");
        }}
      />
    </div>
  );
}
