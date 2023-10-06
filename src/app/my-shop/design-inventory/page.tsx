"use client";

import DesignItemCard from "@/components/Cards/DesignItemCard/DesignItemCard";
import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import { fetcher } from "@/services/backend/axiosClient";
import { deleteDesignItemApi } from "@/services/backend/services/designInventory";
import { SimpleDesignItem } from "@/types/DesignItem";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { Button, Pagination, Paper, Transition } from "@mantine/core";
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
    pageSize: 5,
    pageNumber: 1,
    category: null,
    sortDirection: "ASC",
  });
  const {
    data: response,
    isLoading,
    mutate,
  } = useSWR<CommonResponseBase<PaginationResponseBase<SimpleDesignItem>>>(
    ["/inventory-items", params.pageNumber],
    () => {
      console.log(params);
      return fetcher(
        `/inventory-item?${new URLSearchParams({
          pageSize: params.pageSize.toString(),
          pageNumber: params.pageNumber.toString(),
        }).toString()}`
      );
    }
  );

  if (!isLoading && response?.data.totalSize === 0) {
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
      <div className="w-full flex gap-x-5 mt-4 h-[700px]">
        <div className="detail-wrapper flex-1 flex justify-center items-center h-[700px]">
          {typeof selectedDesign === "undefined" && (
            <h1 className="mb-48">Pick a design to see detail!</h1>
          )}
          <Transition
            mounted={typeof selectedDesign !== "undefined"}
            transition="fade"
            duration={200}
            timingFunction="ease"
            keepMounted={false}
          >
            {(styles) => (
              <Paper
                className="design-detail-card p-4 bg-white rounded-md w-full h-full flex flex-col justify-between"
                style={{ ...styles }}
              >
                <div>
                  <div className="w-full aspect-video rounded-md relative">
                    <ImageWithFallback
                      alt="test"
                      fill
                      src={
                        selectedDesign?.variant.productBase.attaches.find(
                          (a) => a.type === "THUMBNAIL"
                        )?.url
                      }
                    />
                  </div>
                  <h1 className="mt-4">{selectedDesign!.name}</h1>
                  <div className="flex w-full">
                    <div>
                      <strong>Product base:</strong>
                      <span>{selectedDesign!.variant.productBase.name}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Varaints</h3>
                    <div className="grid grid-cols-2 gap-x-2 mt-2">
                      {selectedDesign!.variant.variantCombinations.map(
                        (combination) => {
                          const combinationOption =
                            selectedDesign!.variant.productBase.productOptions.find(
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
                <div className="actions w-full flex justify-end gap-x-2">
                  <Button
                    variant="outline"
                    onClick={async () => {
                      await deleteDesignItemApi(selectedDesign!.id.toString());
                      mutate();
                      setSelectedDesign(undefined);
                    }}
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={() =>
                      router.push(`/product-design/${selectedDesign!.id}`)
                    }
                  >
                    Edit!
                  </Button>
                </div>
              </Paper>
            )}
          </Transition>
        </div>
        <div className="inventory-list flex-1 flex flex-col gap-y-4">
          {!isLoading &&
            response?.data.items?.map((designItem) => (
              <DesignItemCard
                onClick={() => setSelectedDesign(designItem)}
                key={designItem.id}
                data={designItem}
                classNames={{
                  root:
                    selectedDesign?.id === designItem.id
                      ? "border border-primary"
                      : undefined,
                }}
              />
            ))}
          <div className="flex justify-center mt-6 mb-20">
            <Pagination
              value={params.pageNumber}
              onChange={(e) => {
                console.log(
                  "🚀 ~ file: page.tsx:166 ~ DesignInventoryPage ~ e:",
                  e
                );
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
