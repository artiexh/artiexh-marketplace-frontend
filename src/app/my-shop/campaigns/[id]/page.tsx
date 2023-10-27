"use client";

import DesignItemCard from "@/components/Cards/DesignItemCard/DesignItemCard";
import Thumbnail from "@/components/CreateProduct/Thumbnail";
import FileUpload from "@/components/FileUpload/FileUpload";
import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import PrivateImageLoader from "@/components/PrivateImageLoader/PrivateImageLoader";
import TableComponent from "@/components/TableComponent";
import { NOTIFICATION_TYPE } from "@/constants/common";
import CustomWebTab from "@/containers/CampaignContainers/CustomWebTab";
import useCategories from "@/hooks/useCategories";
import useTags from "@/hooks/useTags";
import axiosClient, { fetcher } from "@/services/backend/axiosClient";
import {
  CamapignDetail,
  CustomProduct,
  calculateDesignItemConfig,
  updateCampaignCustomProductsApi,
  updateCampaignGeneralInfoApi,
  updateCampaignProviderApi,
  updateCampaignStatusApi,
} from "@/services/backend/services/campaign";
import { SimpleDesignItem } from "@/types/DesignItem";
import { Tag } from "@/types/Product";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { TableColumns } from "@/types/Table";
import { currencyFormatter } from "@/utils/formatter";
import { getNotificationIcon } from "@/utils/mapper";
import {
  Accordion,
  ActionIcon,
  Badge,
  Button,
  Center,
  Indicator,
  Input,
  MultiSelect,
  NumberInput,
  Pagination,
  Popover,
  SegmentedControl,
  Select,
  Stepper,
  Table,
  Tabs,
  Text,
  TextInput,
  Textarea,
  Timeline,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconArchive,
  IconBallpen,
  IconCircle,
  IconCircleMinus,
  IconCirclePlus,
  IconEye,
  IconHelpCircle,
} from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function CampaignDetailPage() {
  const router = useRouter();
  const params = useParams();

  const id = params!.id as string;

  const {
    data: res,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["campaign", { id: id }],
    queryFn: async () => {
      const res = await axiosClient.get<CommonResponseBase<CamapignDetail>>(
        `/campaign/${id}`
      );

      return res.data;

      return {
        timestamp: 1,
        path: "/",
        message: "",
        status: 200,
        data: {
          name: "Campaign mùa đông",
          type: "SHARE",
          status: "REQUEST_CHANGE",
          campaignHistories: [
            {
              action: "CREATE",
              eventTime: "10-12-2023",
              message: "Create campaign",
              updatedBy: "Artist01",
            },
            {
              action: "SUBMIT",
              eventTime: "11-12-2023",
              message: "Submit campaign",
              updatedBy: "Artist01",
            },
            {
              action: "REQUEST_CHANGE",
              eventTime: "12-12-2023",
              message: "Change product price",
              updatedBy: "Admin",
            },
            {
              action: "SUBMIT",
              eventTime: "13-12-2023",
              message: "Submit campaign",
              updatedBy: "Artist01",
            },
            {
              action: "REQUEST_CHANGE",
              eventTime: "12-12-2023",
              message: "Change product quantity",
              updatedBy: "Admin",
            },
          ],
        },
      } as CommonResponseBase<CamapignDetail>;
    },
  });

  const submitCampaignHandler = async () => {
    const res = await updateCampaignStatusApi(id, {
      message: "Submit to admin",
      status: "WAITING",
    });

    if (res != null) {
      notifications.show({
        message: "Gửi yêu cầu thành công",
        ...getNotificationIcon(NOTIFICATION_TYPE.SUCCESS),
      });
    } else {
      notifications.show({
        message: "Gửi yêu cầu thất bại! Vui lòng thử lại!",
        ...getNotificationIcon(NOTIFICATION_TYPE.FAILED),
      });
    }

    refetch();
  };

  const deleteCampaignHandler = async () => {
    const res = await updateCampaignStatusApi(id, {
      message: "Cancel campaign",
      status: "CANCELED",
    });

    if (res != null) {
      notifications.show({
        message: "Xóa thành công",
        ...getNotificationIcon(NOTIFICATION_TYPE.SUCCESS),
      });
    } else {
      notifications.show({
        message: "Xóa thất bại! Vui lòng thử lại!",
        ...getNotificationIcon(NOTIFICATION_TYPE.FAILED),
      });
    }

    refetch();
  };

  if (isLoading || !res?.data) return null;

  const customProducts = res!.data.customProducts;

  return (
    <>
      <div className="mt-10 bg-white rounded-md  px-4 py-2.5 flex flex-col">
        <div className="flex justify-between items-center">
          <div className="flex gap-x-2.5 items-center">
            <Badge>{res.data.status}</Badge>
            <h1 className="text-2xl">{res.data.name}</h1>
          </div>

          <div className="h-fit flex gap-x-3">
            <Button
              disabled={["APPROVED", "REJECTED", "CANCELED"].includes(
                res.data.status
              )}
              onClick={deleteCampaignHandler}
              className="mb-0"
            >
              Delete
            </Button>
            <Button
              disabled={!["DRAFT", "REQUEST_CHANGE"].includes(res.data.status)}
              onClick={submitCampaignHandler}
              className="mb-0"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
      <Tabs defaultValue="general-info" className="mt-5">
        <Tabs.List>
          <Tabs.Tab value="general-info">Info</Tabs.Tab>
          <Tabs.Tab value="promote-details">Web</Tabs.Tab>
          <Tabs.Tab value="history">History</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="general-info">
          <CampaignGeneralInfoForm
            disabled={!["DRAFT", "REQUEST_CHANGE"].includes(res.data.status)}
            data={{
              name: res.data.name,
              description: res.data.description,
              campaignHistories: res.data.campaignHistories ?? [],
              type: res.data.type,
            }}
          />
          <div className="mt-4">
            <CustomProductTable data={res.data.customProducts} />
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="promote-details">
          <CustomWebTab />
        </Tabs.Panel>
        <Tabs.Panel value="history">
          <h1>History</h1>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}

const customProductColumns: TableColumns<
  CamapignDetail["customProducts"][0] & { onEdit?: Function }
> = [
  {
    title: "Name",
    key: "name",
    render: (record) => (
      <div className="flex items-center gap-5">
        <div className="relative w-16 aspect-square">
          <PrivateImageLoader
            className="rounded-md"
            id={record.inventoryItem.thumbnail?.id.toString()}
            alt="test"
            fill
          />
        </div>
        <div>
          <div>{record.name}</div>
          <div className="text-sm text-gray-500">
            Template: {record.inventoryItem.productBase.name}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Giá sản xuất",
    key: "manufacturingPrice",
    render: (record) =>
      record?.providerConfig.basePriceAmount ? (
        <span>
          {currencyFormatter("vn", {
            amount: record?.providerConfig.basePriceAmount,
            unit: "VND",
          })}
        </span>
      ) : (
        <span>Không khả dụng</span>
      ),
  },
  {
    title: "Giá bán",
    key: "salePrice",
    render: (record) =>
      record?.price ? (
        <span>
          {currencyFormatter("vn", {
            ...record.price,
            amount: Number(record.price.amount),
          })}
        </span>
      ) : (
        <span>Không khả dụng</span>
      ),
  },
  {
    title: "Số lượng",
    key: "quantity",
    render: (record) =>
      record?.quantity ? (
        <span>{record.quantity}</span>
      ) : (
        <span>Không khả dụng</span>
      ),
  },

  {
    title: "Action",
    key: "action",
    className: "!text-center",
    render: (record) => (
      <div className="flex justify-center gap-x-2">
        <Tooltip label="Edit">
          <IconBallpen
            className="cursor-pointer"
            onClick={() => record.onEdit && record.onEdit()}
          />
        </Tooltip>
      </div>
    ),
  },
];

function CampaignGeneralInfoForm({
  data,
  disabled = false,
}: {
  data: Pick<
    CamapignDetail,
    "name" | "description" | "campaignHistories" | "type"
  >;
  disabled?: boolean;
}) {
  const queryClient = useQueryClient();
  const params = useParams();

  const id = params!.id as string;
  const form = useForm<{
    name: string;
    description?: string;
    type: "SHARE" | "PRIVATE";
  }>({
    initialValues: { ...data },
  });
  const submitHandler = async () => {
    const campaignRes = queryClient.getQueryData<
      CommonResponseBase<CamapignDetail>
    >(["campaign", { id: params!.id as string }]);
    if (!campaignRes?.data) return;
    const res = await updateCampaignGeneralInfoApi(campaignRes.data, {
      ...form.values,
    });

    if (res != null) {
      notifications.show({
        message: "Chỉnh sửa thành công",
        ...getNotificationIcon(NOTIFICATION_TYPE.SUCCESS),
      });
    } else {
      notifications.show({
        message: "Chỉnh sửa thất bại! Vui lòng thử lại!",
        ...getNotificationIcon(NOTIFICATION_TYPE.FAILED),
      });
    }

    queryClient.refetchQueries(["campaign", { id: params!.id as string }]);
  };

  useEffect(() => {
    form.setValues({ ...data });
  }, [data]);

  return (
    <div className="card general-wrapper mt-2">
      <form onSubmit={form.onSubmit(submitHandler)}>
        <div className="flex w-full justify-between items-center">
          <h2 className="text-3xl font-bold">Campaign information</h2>
          <Button type="submit" disabled={disabled || !form.isDirty()}>
            Submit
          </Button>
        </div>
        <div className="flex gap-x-4">
          <div className="flex flex-col space-y-4 mt-6 flex-[3]">
            <div className="flex items-end gap-x-2">
              <TextInput
                disabled={disabled}
                label="Campaign name"
                {...form.getInputProps("name")}
                className="flex-[3]"
              />
              <SegmentedControl
                {...form.getInputProps("type")}
                className="h-fit flex-[2]"
                data={[
                  { label: "Private", value: "PRIVATE" },
                  { label: "Shared", value: "SHARE" },
                ]}
              />
            </div>
            <Textarea
              disabled={disabled}
              label="Description"
              {...form.getInputProps("description")}
            />
          </div>
          <div className="flex-[2]">
            <Timeline active={0} bulletSize={18} lineWidth={2}>
              {data.campaignHistories?.slice(-3).map((step) => (
                <Timeline.Item
                  key={step.eventTime}
                  title={`${step.action} - ${step.updatedBy}`}
                >
                  <Text c="dimmed" size="sm">
                    {step.message}
                  </Text>
                  <Text size="xs" mt={4}>
                    {step.eventTime}
                  </Text>
                </Timeline.Item>
              ))}
            </Timeline>
          </div>
        </div>
      </form>
    </div>
  );
}

function PickCustomProduct({
  defaultValues,
}: {
  defaultValues: CustomProduct[];
}) {
  const routerParams = useParams();
  const queryClient = useQueryClient();

  const id = routerParams!.id as string;
  const [selectedDesign, setSelectedDesign] = useState<
    SimpleDesignItem | undefined
  >(defaultValues.map((e) => e.inventoryItem as SimpleDesignItem));

  const [collection, setCollection] = useState<SimpleDesignItem[]>([]);

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

  if (isLoading) return null;

  if (response?.data.totalSize === 0) {
    return (
      <div className="h-screen w-full flex flex-col justify-center items-center">
        <h1>
          You have no design item to create campaign. Create your first design
          now!
        </h1>
        <Button className="mt-5" variant="default">
          Create new design
        </Button>
      </div>
    );
  }

  const pickCustomProducts = async () => {
    console.log("helllu");
    try {
      const campaignRes = queryClient.getQueryData<
        CommonResponseBase<CamapignDetail>
      >(["campaign", { id: id }]);
      if (!campaignRes?.data) throw new Error("What the heck");
      const res = await updateCampaignCustomProductsApi(
        campaignRes.data,
        collection.map((v) => {
          return {
            name: v.name,
            description: v.description,
            tags: v.tags,
            inventoryItemId: v.id,
          } as Pick<
            CustomProduct,
            | "name"
            | "description"
            | "tags"
            | "attaches"
            | "limitPerOrder"
            | "price"
            | "quantity"
          > & { inventoryItemId: string };
        })
      );
      queryClient.setQueryData(["campaign", { id: id }], res.data);
      modals.close("custom-product-create-campaign");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div className="flex w-full gap-x-4 justify-end items-center mt-3">
        <Indicator
          classNames={{
            root: "h-fit",
            indicator: "py-2",
          }}
          label={collection.length}
        >
          <IconArchive className="w-6" />
        </Indicator>
        <Button onClick={pickCustomProducts}>Update</Button>
      </div>
      <div className="inventory-list flex-1 flex flex-col gap-y-4">
        {response?.data.items?.map((designItem) => (
          <DesignItemCard
            key={designItem.id}
            data={designItem}
            actions={
              <div className="flex gap-x-2">
                <Tooltip label="View design detail">
                  <IconEye
                    className="w-6 aspect-square"
                    onClick={() => setSelectedDesign(designItem)}
                  />
                </Tooltip>
                {collection
                  .map((el) => el.id.toString())
                  .indexOf(designItem.id.toString()) === -1 ? (
                  <Tooltip label="Add design to campaign">
                    <IconCirclePlus
                      className="w-6 aspect-square"
                      onClick={() =>
                        setCollection((prev) => [...prev, designItem])
                      }
                    />
                  </Tooltip>
                ) : (
                  <Tooltip label="Remove design from campaign">
                    <IconCircleMinus
                      className="w-6 aspect-square"
                      onClick={() =>
                        setCollection((prev) =>
                          prev.filter(
                            (str) =>
                              str.id.toString() !== designItem.id.toString()
                          )
                        )
                      }
                    />
                  </Tooltip>
                )}
              </div>
            }
          />
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
    </>
  );
}

function PickProvider({ data }: { data: CustomProduct[] }) {
  const [provider, setProvider] = useState<string>();
  const routerParams = useParams();
  const queryClient = useQueryClient();

  const id = routerParams!.id as string;
  const { data: response, isLoading } = useSWR(
    ["provider-configs", ...data.map((el) => el.id)],
    () =>
      calculateDesignItemConfig(data.map((e) => e.inventoryItem.id.toString()))
  );

  const pickProviderHandler = async () => {
    try {
      const campaignRes = queryClient.getQueryData<
        CommonResponseBase<CamapignDetail>
      >(["campaign", { id: id }]);
      if (!campaignRes?.data) throw new Error("What the heck");
      const res = await updateCampaignProviderApi(
        campaignRes.data,
        provider as string
      );
      queryClient.setQueryData(["campaign", { id: id }], res.data);
      modals.close("provider-create-campaign");
    } catch (e) {
      console.log("🚀 ~ file: page.tsx:578 ~ pickProviderHandler ~ e:", e);
    }
  };

  return (
    <>
      <div className="flex w-full gap-x-4 justify-end items-center">
        <Button disabled={!provider} onClick={pickProviderHandler}>
          Update
        </Button>
      </div>

      {!isLoading && (
        <div className="overflow-y-scroll">
          <Accordion multiple={true} chevronPosition="left">
            {response?.data.data.map((item) => (
              <Accordion.Item value={item.businessName} key={item.businessCode}>
                <Center>
                  <Accordion.Control>
                    {item.designItems.length === data.length ? (
                      <div>
                        {item.businessName} - Tổng giá:
                        {item.designItems.reduce(
                          (prev, cur) =>
                            cur.config?.basePriceAmount ?? 0 + prev,
                          0
                        )}
                      </div>
                    ) : (
                      <div className="!text-gray-500">
                        {item.businessName} - Có sản phẩm không hỗ trợ
                      </div>
                    )}
                  </Accordion.Control>
                  <ActionIcon variant="subtle" color="gray" className="ml-4">
                    {provider === item.businessCode ? (
                      <img
                        src="/assets/logo.svg"
                        onClick={() => setProvider(undefined)}
                      />
                    ) : (
                      <IconCircle
                        className={clsx(
                          "w-10",
                          item.designItems.length !== data.length &&
                            "text-gray-500 cursor-default"
                        )}
                        size={24}
                        width={24}
                        height={24}
                        onClick={
                          item.designItems.length === data.length
                            ? () => setProvider(item.businessCode)
                            : undefined
                        }
                      />
                    )}
                  </ActionIcon>
                </Center>
                <Accordion.Panel>
                  {
                    <Table>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Design</Table.Th>
                          <Table.Th>Price</Table.Th>
                          <Table.Th>Time</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {data?.map((customProduct) => {
                          const configItem = item.designItems.find(
                            (el) => el.id === customProduct.inventoryItem.id
                          );

                          if (!configItem) {
                            return (
                              <Table.Tr
                                className="text-red-600"
                                key={customProduct.name}
                              >
                                <Table.Td>{customProduct.name}</Table.Td>
                                <Table.Td>Không hỗ trợ</Table.Td>
                                <Table.Td>Không hỗ trợ</Table.Td>
                              </Table.Tr>
                            );
                          }
                          return (
                            <Table.Tr key={customProduct.name}>
                              <Table.Td>{customProduct.name}</Table.Td>
                              <Table.Td>
                                {configItem.config.basePriceAmount}
                              </Table.Td>
                              <Table.Td>
                                {configItem.config.manufacturingTime}
                              </Table.Td>
                            </Table.Tr>
                          );
                        })}
                      </Table.Tbody>
                    </Table>
                  }
                </Accordion.Panel>
              </Accordion.Item>
            )) ?? null}
          </Accordion>
        </div>
      )}
    </>
  );
}

function CustomProductTable({
  data: rawData,
  disabled = false,
}: {
  data: CamapignDetail["customProducts"];
  disabled?: boolean;
}) {
  const routerParams = useParams();
  const queryClient = useQueryClient();

  const id = routerParams!.id as string;
  const campaignRes = queryClient.getQueryData<
    CommonResponseBase<CamapignDetail>
  >(["campaign", { id: id }]);
  const openCustomProductModal = () => {
    modals.open({
      modalId: "custom-product-create-campaign",
      title: "Pick custom products",
      centered: true,
      classNames: {
        content: "!max-h-none",
      },
      fullScreen: true,
      children: <PickCustomProduct defaultValues={rawData} />,
    });
  };

  const openProviderModal = () => {
    modals.open({
      modalId: "provider-create-campaign",
      title: "Pick provider",
      centered: true,
      classNames: {
        content: "!max-h-none",
      },
      fullScreen: true,
      children: <PickProvider data={rawData} />,
    });
  };

  return (
    <>
      <div className="table-header flex w-full justify-between">
        <div>
          <Button onClick={openCustomProductModal}>Add item</Button>
        </div>
        <div className="flex justify-end gap-x-2 items-center">
          <Text>
            Provider:{" "}
            {campaignRes?.data?.provider?.businessName ?? "Không khả dụng"}
          </Text>
          <Button onClick={openProviderModal}>Pick provider</Button>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 w-full mt-3">
        <TableComponent columns={customProductColumns} data={rawData} />
      </div>
    </>
  );
}
