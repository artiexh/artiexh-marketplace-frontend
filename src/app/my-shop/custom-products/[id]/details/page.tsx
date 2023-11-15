"use client";

import CustomProductDetailContainer from "@/containers/CreateProductContainer/CustomProductDetailContainer";
import { fetcher } from "@/services/backend/axiosClient";
import { CustomProductGeneralInfo } from "@/types/CustomProduct";
import { CommonResponseBase } from "@/types/ResponseBase";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const CreatePage = () => {
  const params = useParams();

  const { data: response, isLoading } = useQuery<
    CommonResponseBase<CustomProductGeneralInfo>
  >(["/custom-product/[id]/general", { id: params?.id as string }], () => {
    return fetcher(`/custom-product/${params?.id as string}/general`);
  });

  if (isLoading || !response?.data) return null;

  return (
    <div className="layout-with-sidenav max-w-7xl mx-auto flex gap-10 px-5">
      <CustomProductDetailContainer data={response.data} />
    </div>
  );
};

export default CreatePage;
