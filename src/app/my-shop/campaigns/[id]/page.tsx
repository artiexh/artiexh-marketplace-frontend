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
      record?.providerConfig?.basePriceAmount ? (
        <span>
          {currencyFormatter("vn", {
            amount: record?.providerConfig?.basePriceAmount,
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
  >();

  const [collection, setCollection] = useState<SimpleDesignItem[]>(
    defaultValues.map((e) => e.inventoryItem as unknown as SimpleDesignItem)
  );

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

  return (
    <>
      <div className="flex gap-x-4">
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
        <div className="flex-1">
          <PickProvider data={collection} />
        </div>
      </div>
    </>
  );
}

function PickProvider({ data }: { data: SimpleDesignItem[] }) {
  const routerParams = useParams();
  const queryClient = useQueryClient();

  const id = routerParams!.id as string;
  const [provider, setProvider] = useState<string | undefined>(() => {
    const campaignRes = queryClient.getQueryData<
      CommonResponseBase<CamapignDetail>
    >(["campaign", { id: id }]);

    return campaignRes?.data?.provider?.businessCode;
  });
  console.log("🚀 ~ file: page.tsx:607 ~ PickProvider ~ provider:", provider);
  const { data: response, isLoading } = useSWR(
    ["provider-configs", ...data.map((el) => el.id)],
    () => calculateDesignItemConfig(data.map((e) => e.id.toString()))
  );

  const pickProviderHandler = async () => {
    try {
      const campaignRes = queryClient.getQueryData<
        CommonResponseBase<CamapignDetail>
      >(["campaign", { id: id }]);
      if (!campaignRes?.data) throw new Error("What the heck");
      const res = await updateCampaignCustomProductsApi(
        campaignRes.data,
        data.map((v) => {
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
      const resProvider = await updateCampaignProviderApi(
        res.data.data,
        provider as string
      );
      queryClient.setQueryData(["campaign", { id: id }], resProvider.data);
      modals.close("custom-product-create-campaign");
    } catch (e) {
      console.log("🚀 ~ file: page.tsx:578 ~ pickProviderHandler ~ e:", e);
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
          label={data.length}
        >
          <IconArchive className="w-6" />
        </Indicator>
        <Button onClick={pickProviderHandler}>Update</Button>
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
                      <thead>
                        <tr>
                          <th>Design</th>
                          <th>Price</th>
                          <th>Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.map((designItem) => {
                          const configItem = item.designItems.find(
                            (el) => el.id === designItem.id
                          );

                          if (!configItem) {
                            return (
                              <tr
                                className="text-red-600"
                                key={designItem.name}
                              >
                                <td>{designItem.name}</td>
                                <td>Không hỗ trợ</td>
                                <td>Không hỗ trợ</td>
                              </tr>
                            );
                          }
                          return (
                            <tr key={designItem.name}>
                              <td>{designItem.name}</td>
                              <td>{configItem.config.basePriceAmount}</td>
                              <td>{configItem.config.manufacturingTime}</td>
                            </tr>
                          );
                        })}
                      </tbody>
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
        <div className="flex justify-end gap-x-2 items-center">
          <Text>
            Provider:{" "}
            {campaignRes?.data?.provider?.businessName ?? "Không khả dụng"}
          </Text>
          {/* <Button onClick={openProviderModal} disabled={rawData.length <= 0}>
            Pick provider
          </Button> */}
        </div>
        <div>
          <Button onClick={openCustomProductModal}>Add item</Button>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 w-full mt-3">
        <TableComponent
          columns={customProductColumns}
          data={rawData
            .sort((a, b) => Number(a.id) - Number(b.id))
            .map((data) => {
              return {
                ...data,
                onEdit: () =>
                  modals.open({
                    modalId: `${data.inventoryItem.id}-custom-product-edit`,
                    title: "Edit",
                    centered: true,
                    classNames: {
                      content: "!w-[30rem] !h-fit left-[38%] top-1/3",
                    },

                    children: <EditCustomProductModal data={data} />,
                  }),
              };
            })}
        />
      </div>
    </>
  );
}

function EditCustomProductModal({
  data: customProduct,
}: {
  data: CustomProduct;
}) {
  const routerParams = useParams();
  const queryClient = useQueryClient();

  const id = routerParams!.id as string;
  const form = useForm<{
    quantity: number;
    price: number;
  }>({
    validate: {
      price: (value, values, path) => {
        const index = Number(path.split(".")[1]);
        const config = customProduct;
        if (config && config.providerConfig.basePriceAmount >= value) {
          return `Price of this product should be greater than ${config.providerConfig.basePriceAmount}`;
        }
        return null;
      },
      quantity: (value, values, path) => {
        const index = Number(path.split(".")[1]);
        const config = customProduct;
        if (config && config.providerConfig.minQuantity > value) {
          return `Quantiy of this product should be equal or greater than ${config.providerConfig.minQuantity}`;
        }
        return null;
      },
    },
    validateInputOnBlur: true,
    validateInputOnChange: true,
  });

  const updateHandler = async (data: { quantity: number; price: number }) => {
    const campaignRes = queryClient.getQueryData<
      CommonResponseBase<CamapignDetail>
    >(["campaign", { id: id }]);
    if (!campaignRes?.data) throw new Error("What the heck");
    const tmp = campaignRes.data.customProducts.filter(
      (d) => d.id !== customProduct.id
    );
    const res = await updateCampaignCustomProductsApi(campaignRes.data, [
      ...tmp.map((v) => {
        return {
          name: v.name,
          description: v.description,
          tags: v.tags,
          inventoryItemId: v.inventoryItem.id,
          quantity: v.quantity,
          price: v.price,
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
      }),
      {
        name: customProduct.name,
        description: customProduct.description,
        tags: customProduct.tags,
        inventoryItemId: customProduct.inventoryItem.id,
        quantity: data.quantity,
        price: {
          amount: data.price,
          unit: "VND",
        },
      },
    ]);
    queryClient.setQueryData(["campaign", { id: id }], res.data);
    modals.close(`${customProduct.inventoryItem.id}-custom-product-edit`);
  };

  return (
    <form onSubmit={form.onSubmit(updateHandler)}>
      <NumberInput
        classNames={{
          label: "w-full flex items-center",
        }}
        label={
          <div className="flex justify-between items-center w-full">
            <span className="flex items-center gap-x-1">
              <span>
                {`Price (Min: ${customProduct.providerConfig.basePriceAmount})`}{" "}
              </span>
              <Popover position="top" withArrow shadow="md">
                <Popover.Target>
                  <IconHelpCircle size={16} className="text-primary" />
                </Popover.Target>
                <Popover.Dropdown style={{ pointerEvents: "none" }}>
                  <span>Your profit = product price - min sale price</span>
                </Popover.Dropdown>
              </Popover>
            </span>
            <span className="text-gray-500">{`Your profit: ${
              Number(form.values.price ?? 0) -
              customProduct.providerConfig.basePriceAmount
            }`}</span>
          </div>
        }
        className="flex-[3]"
        hideControls
        min={1}
        {...form.getInputProps(`price`)}
      />
      <NumberInput
        classNames={{
          label: "w-fit flex items-center",
        }}
        label={
          <div className="flex">
            <span className="flex gap-x-1 items-center">
              <span>
                {`Quantity (Min: ${customProduct.providerConfig.minQuantity})`}{" "}
              </span>
              <Popover position="top" withArrow shadow="md">
                <Popover.Target>
                  <IconHelpCircle size={16} className="text-primary" />
                </Popover.Target>
                <Popover.Dropdown style={{ pointerEvents: "none" }}>
                  <span>
                    The manufacturing provider only accept the quantity that is
                    greater than the minimum quantity
                  </span>
                </Popover.Dropdown>
              </Popover>
            </span>
          </div>
        }
        className="col-span-12 md:col-span-4"
        min={1}
        {...form.getInputProps(`quantity`)}
      />
      <div className="w-full flex justify-end mt-4">
        <Button type="submit">Update</Button>
      </div>
    </form>
  );
}
