"use client";

import CustomProductDetailContainer from "@/containers/CreateProductContainer/CustomProductDetailContainer";
import { fetcher } from "@/services/backend/axiosClient";
import { DesignItemDetail } from "@/types/DesignItem";
import { CommonResponseBase } from "@/types/ResponseBase";
import { useParams } from "next/navigation";
import useSWR from "swr";

const CreatePage = () => {
  const params = useParams();

  const { data: response, isLoading } = useSWR<
    CommonResponseBase<DesignItemDetail>
  >(["/inventory-items/[id]", params?.id as string], () => {
    return fetcher(`/inventory-item/${params?.id as string}`);
  });

  console.log("🚀 ~ file: page.tsx:14 ~ CreatePage ~ response:", response);

  if (isLoading || !response?.data) return null;

  return (
    <div className="layout-with-sidenav max-w-7xl mx-auto flex gap-10 px-5">
      <CustomProductDetailContainer data={response.data} />
    </div>
  );
};

export default CreatePage;

// TODO: Check artist role
