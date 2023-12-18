"use client";

import PrivateImageLoader from "@/components/PrivateImageLoader/PrivateImageLoader";
import TableComponent from "@/components/TableComponent";
import { NOTIFICATION_TYPE } from "@/constants/common";
import axiosClient from "@/services/backend/axiosClient";
import { deleteCustomProductApi } from "@/services/backend/services/customProduct";
import { SimpleCustomProduct } from "@/types/CustomProduct";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { TableColumns } from "@/types/Table";
import { ValidationError } from "@/utils/error/ValidationError";
import { errorHandler } from "@/utils/errorHandler";
import { getNotificationIcon } from "@/utils/mapper";
import { ActionIcon, Button, Input, Pagination, Tooltip } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconBallpen,
  IconPalette,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

const ShopProductsPage = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [params, setParams] = useState<{ [key: string]: any }>({
    pageSize: 6,
    pageNumber: 1,
    sortBy: null,
    sortDirection: "ASC",
  });

  const {
    data: response,
    isLoading,
    mutate,
  } = useSWR(["custom-product", ...Object.values(params)], () =>
    axiosClient.get<
      CommonResponseBase<PaginationResponseBase<SimpleCustomProduct>>
    >("/custom-product", {
      params: {
        ...params,
        sortBy: "id",
        sortDirection: "DESC",
      },
    })
  );

  const data = response?.data.data;

  const deleteCustomProductMutation = useMutation({
    mutationFn: async (data: SimpleCustomProduct) => {
      if (typeof data.campaignLock !== "undefined") {
        throw new ValidationError(
          "Sản phẩm này đang thuộc vào một chiến dịch, không thể xóa"
        );
      }
      await deleteCustomProductApi(data.id);
    },
    onSuccess: () => {
      notifications.show({
        message: "Xóa thành công",
        ...getNotificationIcon(NOTIFICATION_TYPE.SUCCESS),
      });
    },
    onError: (e) => {
      errorHandler(e);
    },
    onSettled: () => {
      mutate();
    },
  });

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          leftIcon={<IconPlus />}
          type="button"
          onClick={() => router.push(`/my-shop/custom-products/create`)}
          variant="outline"
        >
          Thiết kế sản phẩm mới
        </Button>
      </div>
      <div className="py-5 px-7 bg-white shadow rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="text-3xl font-bold">
              Danh sách sản phẩm tùy chỉnh
            </div>
            {data?.totalSize ? (
              <div className="text-[#AFAFAF] mt-1">
                {/* TODO: Replace with API call later or filter based on response */}
                {data?.totalSize} sản phẩm tùy chỉnh
              </div>
            ) : null}
          </div>
          <div>
            <Input
              className="w-[300px]"
              icon={<IconSearch />}
              placeholder="Tìm kiếm..."
              onChange={(e) => {
                setParams({
                  ...params,
                  name: e.target.value,
                  pageNumber: 1,
                });
              }}
            />
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 w-full">
          {!isLoading && (
            <TableComponent
              columns={customProductColumns}
              data={data?.items.map((item) => {
                return {
                  ...item,
                  onDesign: () =>
                    router.push(`/my-shop/custom-products/${item.id}/design`),
                  onEdit: () =>
                    router.push(`/my-shop/custom-products/${item.id}/details`),
                  onDelete: () => {
                    deleteCustomProductMutation.mutate(item);
                  },
                };
              })}
            />
          )}
          <Pagination
            value={params.pageNumber}
            onChange={(value) => setParams({ ...params, pageNumber: value })}
            //TODO: change this to total of api call later
            total={data?.totalPage ?? 1}
            boundaries={2}
            classNames={{
              control: "[&[data-active]]:!text-white",
            }}
          />
        </div>
      </div>
    </div>
  );
};

const customProductColumns: TableColumns<
  SimpleCustomProduct & {
    onDesign: Function;
    onEdit: Function;
    onDelete: Function;
  }
> = [
  {
    title: "Tên",
    key: "name",
    render: (record) => (
      <div className="flex items-center gap-5">
        <div className="relative w-16 aspect-square">
          <PrivateImageLoader
            className="rounded-md object-fill w-full h-full"
            id={record.modelThumbnail?.id.toString()}
            alt="test"
          />
        </div>
        <div>
          <div>{record.name}</div>
          <div className="text-sm text-gray-500">
            Template: {record.category.name}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Thông số",
    key: "variant",
    render: (record) => (
      <span>
        {record.variant.variantCombinations.reduce((prev, combination) => {
          if (!combination.optionValue)
            return prev + `${combination.option.name}: N/A; `;

          return (
            prev +
            `${combination.option.name}: ${combination.optionValue.name}; `
          );
        }, "")}
      </span>
    ),
  },
  {
    title: "Chỉnh sửa lúc",
    key: "modifiedDate",
    render: (record) => (
      <span>
        {new Intl.DateTimeFormat("vi", {
          dateStyle: "long",
          timeStyle: "medium",
        }).format(new Date(record.modifiedDate))}
      </span>
    ),
  },
  {
    title: "Tác vụ",
    key: "action",
    className: "!text-center",

    render: (record) => (
      <div className="flex justify-center gap-x-2 w-[100px]">
        <Tooltip label="Chỉnh sửa">
          <ActionIcon onClick={() => record.onEdit && record.onEdit()}>
            <IconBallpen />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Thiết kế">
          <ActionIcon onClick={() => record.onDesign && record.onDesign()}>
            <IconPalette />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Xoá">
          <ActionIcon onClick={() => record.onDelete && record.onDelete()}>
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </div>
    ),
  },
];

export default ShopProductsPage;
