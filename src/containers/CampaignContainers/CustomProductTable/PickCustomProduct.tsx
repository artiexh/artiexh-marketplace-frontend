import DesignItemCard from "@/components/Cards/DesignItemCard/DesignItemCard";
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
import {
  Accordion,
  ActionIcon,
  Button,
  Center,
  Indicator,
  Pagination,
  Table,
  Tooltip,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconArchive,
  IconCircle,
  IconCircleMinus,
  IconCirclePlus,
} from "@tabler/icons-react";
import { IconEye } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { useState } from "react";
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
    sortDirection: "ASC",
  });
  const {
    data: response,
    isLoading,
    mutate,
  } = useSWR<CommonResponseBase<PaginationResponseBase<SimpleCustomProduct>>>(
    ["/custom-products", params.pageNumber],
    () => {
      return fetcher(
        `/custom-product?${new URLSearchParams({
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

  const pickProviderHandler = async () => {
    try {
      const campaignRes = queryClient.getQueryData<
        CommonResponseBase<CampaignDetail>
      >([ARTIST_CAMPAIGN_ENDPOINT, { id: id }]);

      if (!campaignRes?.data) throw new Error("What the heck");
      const res = await updateCampaignCustomProductsApi(
        campaignRes.data,
        data.map((v) => {
          return {
            customProductId: v.id,
          };
        }),
        provider ?? campaignRes.data.provider.businessCode
      );
      queryClient.setQueryData(
        [ARTIST_CAMPAIGN_ENDPOINT, { id: id }],
        res.data
      );
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
                    {item.customProducts.length === data.length ? (
                      <div>
                        {item.businessName} - Tổng giá:
                        {item.customProducts.reduce(
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
                          <th>Design</th>
                          <th>Price</th>
                          <th>Time</th>
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
