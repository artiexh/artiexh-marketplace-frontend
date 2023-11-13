"use client";

import ProductDetailContainer from "@/containers/ProductContainer/ProductContainer";
import { fetcher } from "@/services/backend/axiosClient";
import { ProductInventory } from "@/types/Product";
import { CommonResponseBase } from "@/types/ResponseBase";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const ProductDetailPage = () => {
  const params = useParams();

  const { data: response, isLoading } = useQuery<
    CommonResponseBase<ProductInventory>
  >(
    ["/product-inventory/[id]/general", { id: params?.productCode as string }],
    () => {
      return fetcher(`/product-inventory/${params?.productCode as string}`);
    }
  );

  if (isLoading || !response?.data) return null;

  return (
    <div className="layout-with-sidenav max-w-7xl mx-auto flex gap-10 px-5">
      <ProductDetailContainer data={response.data} />
    </div>
  );
};

export default ProductDetailPage;
