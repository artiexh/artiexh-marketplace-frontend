"use client";

import DesignItemCard from "@/components/Cards/DesignItemCard/DesignItemCard";
import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import { fetcher } from "@/services/backend/axiosClient";
import { deleteDesignItemApi } from "@/services/backend/services/designInventory";
import { DesignItemDetail, SimpleDesignItem } from "@/types/DesignItem";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import {
  ActionIcon,
  Button,
  List,
  Loader,
  Pagination,
  Paper,
  Spoiler,
  Transition,
} from "@mantine/core";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import {
  IconAlertCircleFilled,
  IconEdit,
  IconEditCircle,
  IconTrash,
} from "@tabler/icons-react";
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
      <div className="w-full flex gap-x-5 mt-4 h-[750px]">
        <div className="detail-wrapper flex-1 flex justify-center items-center h-[750px]">
          {typeof selectedDesign === "undefined" && (
            <h1 className="mb-48">Pick a design to see detail!</h1>
          )}
          {selectedDesign && (
            <DesignItemDetailCard
              setSelectedDesign={setSelectedDesign}
              designItemId={selectedDesign.id.toString()}
            />
          )}
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

type DesignItemDetailCardProps = {
  designItemId: string;
  setSelectedDesign: Function;
};

function DesignItemDetailCard({
  designItemId,
  setSelectedDesign,
}: DesignItemDetailCardProps) {
  const router = useRouter();
  const { data: response, isLoading } = useSWR<
    CommonResponseBase<DesignItemDetail>
  >(["/inventory-items/[id]", designItemId], () => {
    return fetcher(`/inventory-item/${designItemId}`);
  });

  const editHandler = () => {
    router.push(`/product-design/${designItemId}`);
  };

  const deleteHandler = async () => {
    await deleteDesignItemApi(designItemId);
    setSelectedDesign(undefined);
  };

  return (
    <>
      <Paper
        className={clsx("w-full h-full flex justify-center items-center p-4")}
      >
        {isLoading && <Loader color="blue" className="fixed" />}

        <Transition
          mounted={!isLoading}
          transition="fade"
          duration={300}
          timingFunction="ease"
          keepMounted={false}
        >
          {(styles) => (
            <div
              style={{ ...styles }}
              className="w-full h-full flex flex-col gap-y-4"
            >
              <div className="header flex w-full justify-between items-center">
                <div className="text-xl font-semibold">
                  {response?.data.name}
                  <div className="text-sm text-gray-400">
                    Loại: {response?.data.variant.productBase.name}
                  </div>
                </div>
                <div className="actions flex flex-col justify-end">
                  <div className="flex gap-x-1.5 mt-0.5 justify-end">
                    <ActionIcon onClick={editHandler}>
                      <IconEdit size={24} />
                    </ActionIcon>
                    <ActionIcon onClick={deleteHandler}>
                      <IconTrash size={24} color="red" />
                    </ActionIcon>
                  </div>
                </div>
              </div>
              <div className="relative w-full aspect-[4.5/3] rounded-md">
                <ImageWithFallback
                  alt="test"
                  className="rounded-md"
                  fill
                  src={
                    response?.data?.variant.productBase.attaches.find(
                      (a) => a.type === "THUMBNAIL"
                    )?.url
                  }
                />
              </div>
              <div className="content flex flex-col justify-between flex-1">
                <div className="flex flex-col gap-y-4">
                  <div className="variant-details">
                    <div className="text-lg font-semibold">
                      Thông tin thiết kế
                    </div>
                    <div className="mt-1">
                      <List className="grid grid-cols-3">
                        {response?.data.variant.variantCombinations
                          .sort(
                            (a, b) => Number(a.optionId) - Number(b.optionId)
                          )
                          .map((combination) => {
                            const option =
                              response.data.variant.productBase.productOptions.find(
                                (option) => option.id === combination.optionId
                              );
                            const value = option?.optionValues.find(
                              (v) => v.id === combination.optionValueId
                            );
                            if (!option || !value) return null;

                            return (
                              <List.Item
                                key={combination.optionId}
                                className="text-sm col-span-1"
                              >
                                <span className="font-semibold">
                                  {option.name}
                                </span>
                                : {value.name}
                              </List.Item>
                            );
                          })}
                      </List>
                    </div>
                  </div>
                  <div className="variant-details">
                    <div className="text-lg font-semibold">
                      Thông tin hình ảnh
                    </div>
                    <div className="mt-1">
                      <List className="grid grid-cols-2">
                        {!response?.data.variant.productBase.imageCombinations.find(
                          (el) => el.code === response.data.combinationCode
                        ) && (
                          <span className="text-sm col-span-1">
                            Không có thông tin
                          </span>
                        )}
                        {response?.data.variant.productBase.imageCombinations
                          .find(
                            (el) => el.code === response.data.combinationCode
                          )
                          ?.images.map((set) => {
                            const customSet = response.data.imageSet.find(
                              (s) =>
                                s.positionCode === set.code &&
                                s.manufacturingImage &&
                                s.mockupImage
                            );

                            if (!customSet) {
                              return (
                                <List.Item
                                  key={set.code}
                                  icon={
                                    <IconAlertCircleFilled
                                      size={18}
                                      className="text-yellow-400"
                                    />
                                  }
                                  className="text-sm col-span-1"
                                >
                                  <span className="font-semibold">
                                    {set.name}
                                  </span>
                                  : In progress
                                </List.Item>
                              );
                            }

                            return (
                              <List.Item
                                key={set.code}
                                icon={
                                  <IconCircleCheckFilled
                                    size={18}
                                    className="text-green-500"
                                  />
                                }
                                className="text-sm col-span-1"
                              >
                                <span className="font-semibold">
                                  {set.name}
                                </span>
                                : Done
                              </List.Item>
                            );
                          })}
                      </List>
                    </div>
                  </div>

                  {response?.data.description && (
                    <div>
                      <div className="text-lg font-semibold">Mô tả</div>
                      <Spoiler
                        maxHeight={40}
                        showLabel="Show more"
                        hideLabel="Hide"
                        className="text-sm"
                      >
                        {response?.data.description}
                      </Spoiler>
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-xs text-gray-600 text-right">
                    Chỉnh sửa 15 phút trước
                  </div>
                </div>
              </div>
            </div>
          )}
        </Transition>
      </Paper>
    </>
  );
}

export default DesignInventoryPage;
