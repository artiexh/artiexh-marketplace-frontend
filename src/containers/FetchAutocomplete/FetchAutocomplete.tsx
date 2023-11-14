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
      >(`/marketplace/product-in-sale?keyword=${searchKey}&pageSize=8`);

      return result.data.data.items;
    } catch (e) {
      console.log(e);
    }
  });

  return (
    <div className="fetch-autocomplete">
      <Autocomplete
        value={searchKey}
        onChange={(value) => setSearchKey(value)}
        placeholder="Find your favorite product..."
        filter={() => true}
        data={
          data?.map((item) => ({
            value: item.productCode,
            label: item.name,
          })) ?? []
        }
        onItemSubmit={(value) => {
          router.push(`/product/${value.value}`);
          setSearchKey("");
        }}
      />
    </div>
  );
}
