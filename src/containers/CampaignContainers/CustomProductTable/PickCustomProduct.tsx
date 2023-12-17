import DesignItemCard from "@/components/Cards/DesignItemCard/DesignItemCard";
import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import { NOTIFICATION_TYPE } from "@/constants/common";
import { fetcher } from "@/services/backend/axiosClient";
import {
  ARTIST_CAMPAIGN_ENDPOINT,
  calculateDesignItemConfig,
  updateCampaignCustomProductsApi,
} from "@/services/backend/services/campaign";
import { CampaignDetail, CustomProduct } from "@/types/Campaign";
import { SimpleCustomProduct } from "@/types/CustomProduct";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { errorHandler } from "@/utils/errorHandler";
import { currencyFormatter } from "@/utils/formatter";
import { getNotificationIcon } from "@/utils/mapper";
import {
  Accordion,
  ActionIcon,
  Button,
  Center,
  Indicator,
  Input,
  Pagination,
  Table,
  Tooltip,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconArchive,
  IconCircle,
  IconCircleMinus,
  IconCirclePlus,
  IconEye,
} from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import _ from "lodash";
import { useParams } from "next/navigation";
import { ppid } from "process";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";

export default function PickCustomProduct({
  defaultValues,
}: {
  defaultValues: CustomProduct[];
}) {
  const routerParams = useParams();
  const queryClient = useQueryClient();

  const id = routerParams!.id as string;
  const [selectedDesign, setSelectedDesign] = useState<
    SimpleCustomProduct | undefined
  >();

  const [collection, setCollection] = useState<SimpleCustomProduct[]>(
    defaultValues.map((e) => e.customProduct as unknown as SimpleCustomProduct)
  );

  const [params, setParams] = useState({
    pageSize: 5,
    pageNumber: 1,
    category: null,
    sortBy: "id",
    sortDirection: "DESC",
    name: "",
  });
  const {
    data: response,
    isLoading,
    mutate,
  } = useSWR<CommonResponseBase<PaginationResponseBase<SimpleCustomProduct>>>(
    ["/custom-products", params.pageNumber, params.name],
    () => {
      return fetcher(
        `/custom-product?${new URLSearchParams({
          pageSize: params.pageSize.toString(),
          pageNumber: params.pageNumber.toString(),
          name: params.name ?? "",
          sortBy: "id",
          sortDirection: "DESC",
        }).toString()}`
      );
    }
  );

  const searchHandler = useRef(
    _.debounce((value: string) => {
      setParams((prev) => ({
        ...prev,
        pageNumber: 1,
        name: value,
      }));
    }, 500)
  );

  return (
    <>
      <div className="flex gap-x-4">
        <div className="inventory-list flex flex-col flex-1 gap-y-4">
          <Input
            name="name"
            className="w-full"
            placeholder="Tìm kiếm"
            onChange={(e) => searchHandler.current(e.target.value)}
          />
          <div className="min-h-[38rem] flex flex-col gap-y-4">
            {response?.data.items?.map((designItem) => (
              <DesignItemCard
                key={designItem.id}
                data={designItem}
                actions={
                  <div className="flex gap-x-2">
                    <Tooltip label="Xem chi tiết thiết kế">
                      <IconEye
                        className="w-4 aspect-square"
                        onClick={() => setSelectedDesign(designItem)}
                      />
                    </Tooltip>
                    {collection
                      .map((el) => el.id.toString())
                      .indexOf(designItem.id.toString()) === -1 ? (
                      <Tooltip label="Add design to campaign">
                        <IconCirclePlus
                          className="w-4 aspect-square"
                          onClick={() =>
                            setCollection((prev) => [...prev, designItem])
                          }
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip label="Remove design from campaign">
                        <IconCircleMinus
                          className="w-4 aspect-square"
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
          </div>

          <div className="flex justify-center mb-4">
            <Pagination
              value={params.pageNumber}
              onChange={(e) => {
                setParams((prev) => ({
                  ...prev,
                  pageNumber: e,
                }));
              }}
              total={response?.data?.totalPage ?? 0}
              classNames={{
                control: "[&[data-active]]:!text-white",
              }}
            />
          </div>
        </div>
        <div className="flex-1 h-fit">
          <PickProvider data={collection} />
        </div>
      </div>
    </>
  );
}

function PickProvider({ data }: { data: SimpleCustomProduct[] }) {
  const routerParams = useParams();
  const queryClient = useQueryClient();

  const id = routerParams!.id as string;
  const [provider, setProvider] = useState<string | undefined>(() => {
    const campaignRes = queryClient.getQueryData<
      CommonResponseBase<CampaignDetail>
    >([ARTIST_CAMPAIGN_ENDPOINT, { id: id }]);

    return campaignRes?.data?.provider?.businessCode;
  });

  const { data: response, isLoading } = useSWR(
    ["provider-configs", ...data.map((el) => el.id)],
    () => calculateDesignItemConfig(data.map((e) => e.id.toString()))
  );

  const pickProviderMutation = useMutation({
    mutationFn: async () => {
      const campaignRes = queryClient.getQueryData<
        CommonResponseBase<CampaignDetail>
      >([ARTIST_CAMPAIGN_ENDPOINT, { id: id }]);

      if (!campaignRes?.data)
        throw new Error("Có lỗi xảy ra, vui lòng thử lại sau");
      const res = await updateCampaignCustomProductsApi(
        campaignRes.data,
        data.map((v) => {
          return {
            customProductId: v.id,
          };
        }),
        provider ?? campaignRes.data.provider.businessCode
      );

      return res.data;
    },
    onSuccess: (data) => {
      modals.close("custom-product-create-campaign");
      notifications.show({
        message: "Chỉnh sửa thành công",
        ...getNotificationIcon(NOTIFICATION_TYPE.SUCCESS),
      });

      queryClient.setQueryData([ARTIST_CAMPAIGN_ENDPOINT, { id: id }], data);
    },
    onError: (e) => {
      errorHandler(e);
    },
  });

  useEffect(() => {
    if (provider) {
      const tmp = response?.data.data.find(
        (el) => el.businessCode === provider
      );
      if (!tmp || tmp.customProducts.length !== data.length) {
        setProvider(undefined);
        return;
      }
    }
  }, [response]);

  return (
    <>
      <div className="flex w-full gap-x-4 justify-end items-center mt-1">
        <Indicator
          classNames={{
            root: "h-fit",
            indicator: "py-2",
          }}
          label={data.length}
        >
          <IconArchive className="w-6" />
        </Indicator>
        <Button
          disabled={!provider}
          className="!text-white bg-primary mb-4"
          loading={pickProviderMutation.isLoading}
          onClick={() => pickProviderMutation.mutate()}
        >
          Cập nhật
        </Button>
      </div>

      {!isLoading && (
        <div>
          <Accordion
            multiple={true}
            chevronPosition="left"
            className="overflow-y-scroll max-h-[35rem]"
          >
            {response?.data.data
              .sort((a, b) => a.businessCode.localeCompare(b.businessCode))
              .map((item) => (
                <Accordion.Item
                  value={item.businessName}
                  key={item.businessCode}
                >
                  <Center>
                    <Accordion.Control>
                      {item.customProducts.length === data.length ? (
                        <div>{item.businessName}</div>
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
                          alt={""}
                        />
                      ) : (
                        <IconCircle
                          className={clsx(
                            "w-10",
                            item.customProducts.length !== data.length &&
                              "text-gray-500 cursor-default"
                          )}
                          size={24}
                          width={24}
                          height={24}
                          onClick={
                            item.customProducts.length === data.length
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
                            <th>Tên</th>
                            <th>
                              <div className="text-end">Giá sản xuất</div>
                            </th>
                            <th>
                              <div className="text-end">Tối thiểu</div>
                            </th>
                            <th>Thời gian</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data?.map((designItem) => {
                            const configItem = item.customProducts.find(
                              (el) =>
                                el.id.toString() === designItem.id.toString()
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
                                  <td>Không hỗ trợ</td>
                                </tr>
                              );
                            }
                            return (
                              <tr key={designItem.name}>
                                <td>{designItem.name}</td>
                                <td className="text-end">
                                  {currencyFormatter(
                                    configItem.config.basePriceAmount
                                  )}{" "}
                                  / cái
                                </td>
                                <td className="text-end">
                                  {configItem.config.minQuantity} cái
                                </td>
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
