"use client";

import DesignItemCard from "@/components/Cards/DesignItemCard/DesignItemCard";
import { NOTIFICATION_TYPE } from "@/constants/common";
import { fetcher } from "@/services/backend/axiosClient";
import {
  calculateDesignItemConfig,
  createCampaignApi,
} from "@/services/backend/services/campaign";
import { SimpleCustomProduct } from "@/types/CustomProduct";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { getNotificationIcon } from "@/utils/mapper";
import {
  Accordion,
  ActionIcon,
  Button,
  Center,
  Indicator,
  Pagination,
  Table,
  TextInput,
  Textarea,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconArchive,
  IconCircle,
  IconCircleMinus,
  IconCirclePlus,
  IconEye,
} from "@tabler/icons-react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

export default function CreateCampaignPage() {
  const router = useRouter();
  const [selectedDesign, setSelectedDesign] = useState<
    SimpleCustomProduct | undefined
  >();

  const [collection, setCollection] = useState<SimpleCustomProduct[]>([]);

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
  } = useSWR<CommonResponseBase<PaginationResponseBase<SimpleCustomProduct>>>(
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

  //pick design step
  return (
    <div className="h-screen w-full flex flex-col mt-10">
      <div className="w-full flex gap-x-5 mt-4">
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
        <div className="detail-wrapper flex-1  h-[700px]">
          <div className="w-full">
            <PickProviderStep data={collection ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
}

const CreateModalBody = ({
  data,
  providerId,
}: {
  data: SimpleCustomProduct[];
  providerId: string;
}) => {
  const router = useRouter();
  const form = useForm<{
    name: string;
    description?: string;
  }>();
  const submitHandler = async () => {
    try {
      const res = await createCampaignApi({
        ...form.values,
        customProducts: data.map((el) => ({
          inventoryItemId: el.id.toString(),
        })),
        providerId: providerId,
      });

      notifications.show({
        message: "Tạo campaign thành công!",
        ...getNotificationIcon(NOTIFICATION_TYPE.SUCCESS),
      });
      router.push(`/my-shop/campaigns/${res.data.data.id}`);

      modals.close("create-campaign-info");
    } catch (err) {
      notifications.show({
        message: "Tạo campaign thất bại! Vui lòng thử lại",
        ...getNotificationIcon(NOTIFICATION_TYPE.FAILED),
      });
    }
  };
  return (
    <form
      onSubmit={form.onSubmit(submitHandler)}
      className="flex flex-col gap-4"
    >
      <TextInput label="Campaign name" {...form.getInputProps("name")} />
      <Textarea label="Description" {...form.getInputProps("description")} />
      <div className="flex justify-end ">
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};

function PickProviderStep({ data }: { data: SimpleCustomProduct[] }) {
  const [provider, setProvider] = useState<string>();
  const { data: response, isLoading } = useSWR(
    ["provider-configs", ...data.map((el) => el.id)],
    () => calculateDesignItemConfig(data.map((e) => e.id.toString()))
  );

  const createCampaign = async () => {
    console.log("hellu");
    modals.open({
      modalId: "create-campaign-info",
      title: "Input campaign information",
      classNames: {
        content: "!w-fit !h-fit top-1/3 left-[40%]",
      },
      centered: true,
      children: <CreateModalBody data={data} providerId={provider as string} />,
    });
  };

  return (
    <>
      <div className="flex w-full gap-x-4 justify-end items-center">
        <Indicator
          classNames={{
            root: "h-fit",
            indicator: "py-2",
          }}
          label={data.length}
        >
          <IconArchive className="w-6" />
        </Indicator>
        <Button disabled={!provider} onClick={createCampaign}>
          Create campaign!
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
