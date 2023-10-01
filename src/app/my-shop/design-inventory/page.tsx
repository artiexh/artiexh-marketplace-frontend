"use client";

import { fetcher } from "@/services/backend/axiosClient";
import { SimpleDesignItem } from "@/types/DesignItem";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { Button, Pagination } from "@mantine/core";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

const DesignInventoryPage = () => {
  const router = useRouter();
  const [selectedDesign, setSelectedDesign] = useState<
    SimpleDesignItem | undefined
  >();

  const [params, setParams] = useState({
    pageSize: 8,
    pageNumber: 1,
    category: null,
    sortDirection: "ASC",
  });
  const { data: response, isLoading } = useSWR<
    CommonResponseBase<PaginationResponseBase<SimpleDesignItem>>
  >("/inventory-item", () => fetcher("/inventory-item"));

  if (isLoading) return null;

  if (response?.data.totalSize === 0) {
    return (
      <div className="h-screen w-full flex flex-col justify-center items-center">
        <h1>You have no design item. Create your first design now!</h1>
        <Button
          className="mt-5"
          onClick={() => router.push("/product-design")}
          variant="default"
        >
          Create new design
        </Button>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col mt-10">
      <div className="flex w-full justify-end">
        <Button
          onClick={() => router.push("/product-design")}
          variant="default"
        >
          Create new design
        </Button>
      </div>
      <div className="w-full flex gap-x-5 mt-4">
        <div className="detail-wrapper flex-1 flex justify-center items-center">
          {typeof selectedDesign === "undefined" ? (
            <h1 className="mb-48">Pick a design to see detail!</h1>
          ) : (
            <div className="design-detail-card p-4 bg-white rounded-md w-full h-full flex flex-col justify-between">
              <div>
                <div className="w-full aspect-video bg-primary rounded-md" />
                <h1 className="mt-4">{selectedDesign.name}</h1>
                <div className="flex w-full">
                  <div>
                    <strong>Product base:</strong>
                    <span>{selectedDesign.variant.productBase.name}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Varaints</h3>
                  <div className="grid grid-cols-2 gap-x-2 mt-2">
                    {selectedDesign.variant.variantCombinations.map(
                      (combination) => {
                        const combinationOption =
                          selectedDesign.variant.productBase.productOptions.find(
                            (option) => option.id === combination.optionId
                          );
                        return (
                          <div
                            className="col-span-1"
                            key={combination.optionId}
                          >
                            <strong>{combinationOption?.name}: </strong>
                            <span>
                              {
                                combinationOption?.optionValues.find(
                                  (value) =>
                                    value.id === combination.optionValueId
                                )?.name
                              }
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
              <div className="actions w-full flex justify-end">
                <Button
                  className="text-black hover:text-white"
                  onClick={() =>
                    router.push(`/product-design/${selectedDesign.id}`)
                  }
                >
                  Edit!
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="inventory-list flex-1 flex flex-col gap-y-4">
          {response?.data.items?.map((designItem) => (
            <div
              onClick={() => setSelectedDesign(designItem)}
              key={designItem.id}
              className={clsx(
                "bg-white rounded-md p-3.5 cursor-pointer",
                selectedDesign?.id === designItem.id && "border border-primary"
              )}
            >
              <div className="size-description flex gap-x-3">
                <div className="w-20 aspect-square bg-primary rounded-md" />
                <div className="flex flex-col gap-y-3">
                  <div className="text-2xl font-semibold">
                    {designItem.name}
                  </div>
                  <div>
                    <span>
                      Product base: {designItem.variant.productBase.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-center mt-6 mb-20">
            <Pagination
              value={params.pageNumber}
              onChange={(e) => {
                setParams((prev) => ({
                  ...prev,
                  pageNumber: e,
                }));
              }}
              total={response?.data?.totalPage ?? 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignInventoryPage;
