"use client";

import DesignItemCard from "@/components/Cards/DesignItemCard/DesignItemCard";
import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import { fetcher } from "@/services/backend/axiosClient";
import {
  calculateDesignItemConfig,
  createCampaignApi,
} from "@/services/backend/services/campaign";
import { SimpleDesignItem } from "@/types/DesignItem";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { storeDesignItemsForCampaign } from "@/utils/localStorage/campaign";
import {
  Accordion,
  AccordionControlProps,
  ActionIcon,
  Button,
  Center,
  Indicator,
  Pagination,
  Table,
  Tooltip,
} from "@mantine/core";
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
    SimpleDesignItem | undefined
  >();
  const [step, setStep] = useState(0);

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

  if (step === 1) {
    //Pick provider step
    return <PickProviderStep data={collection ?? []} />;
  }

  //pick design step
  return (
    <div className="h-screen w-full flex flex-col mt-10">
      <div className="flex w-full gap-x-4 justify-end items-center">
        <Indicator
          classNames={{
            root: "h-fit",
            indicator: "py-2",
          }}
          label={collection.length}
        >
          <IconArchive className="w-6" />
        </Indicator>
        <Button
          disabled={collection.length === 0}
          onClick={() => setStep(1)}
          variant="default"
        >
          Pick provider
        </Button>
      </div>
      <div className="w-full flex gap-x-5 mt-4">
        <div className="detail-wrapper flex-1 flex justify-center items-center h-[700px]">
          {typeof selectedDesign === "undefined" ? (
            <h1 className="mb-48">Pick a design to see detail!</h1>
          ) : (
            <div className="design-detail-card p-4 bg-white rounded-md w-full h-full flex flex-col justify-between">
              <div>
                <div className="w-full aspect-video relative rounded-md">
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
                {collection
                  .map((el) => el.id.toString())
                  .indexOf(selectedDesign.id.toString()) === -1 ? (
                  <Button
                    onClick={() =>
                      setCollection((prev) => [...prev, selectedDesign])
                    }
                  >
                    Add
                  </Button>
                ) : (
                  <Button
                    onClick={() =>
                      setCollection((prev) =>
                        prev.filter(
                          (str) =>
                            str.id.toString() !== selectedDesign.id.toString()
                        )
                      )
                    }
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          )}
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
      </div>
    </div>
  );
}

function PickProviderStep({ data }: { data: SimpleDesignItem[] }) {
  const router = useRouter();
  const [provider, setProvider] = useState<string>();
  const { data: response, isLoading } = useSWR(["provider-configs"], () =>
    calculateDesignItemConfig(data.map((e) => e.id.toString()))
  );

  const createCampaign = async () => {
    const res = await createCampaignApi({
      customProducts: data.map((el) => ({
        inventoryItemId: el.id.toString(),
      })),
      providerId: provider as string,
    });
    router.push(`/my-shop/campaigns/${res.data.data.id}`);
  };

  if (isLoading) return null;

  return (
    <>
      <div className="w-full flex justify-end">
        <Button disabled={!provider} onClick={createCampaign}>
          Create campaign!
        </Button>
      </div>
      <Accordion multiple={true} chevronPosition="left">
        {response?.data.data.map((item) => (
          <Accordion.Item value={item.businessName} key={item.businessCode}>
            <Center>
              <Accordion.Control>
                <div>
                  {item.businessName} - Tổng giá:{" "}
                  {item.designItems.reduce(
                    (prev, cur) => cur.config?.basePriceAmount ?? 0 + prev,
                    0
                  )}
                </div>
              </Accordion.Control>
              <ActionIcon variant="subtle" color="gray" className="ml-4">
                {provider === item.businessCode ? (
                  <img
                    src="/assets/logo.svg"
                    onClick={() => setProvider(undefined)}
                  />
                ) : (
                  <IconCircle
                    className="w-10"
                    size={24}
                    width={24}
                    height={24}
                    onClick={() => setProvider(item.businessCode)}
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
                    {item.designItems?.map((designItem) => (
                      <tr key={designItem.name}>
                        <td>{designItem.name}</td>
                        <td>{designItem.config?.basePriceAmount}</td>
                        <td>{designItem.config?.manufacturingTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              }
            </Accordion.Panel>
          </Accordion.Item>
        )) ?? null}
      </Accordion>
    </>
  );
}
