"use client";

import Thumbnail from "@/components/CreateProduct/Thumbnail";
import FileUpload from "@/components/FileUpload/FileUpload";
import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import useCategories from "@/hooks/useCategories";
import useTags from "@/hooks/useTags";
import axiosClient from "@/services/backend/axiosClient";
import {
  CamapignDetail,
  CustomProduct,
  updateCampaignCustomProductsApi,
  updateCampaignGeneralInfoApi,
  updateCampaignStatusApi,
} from "@/services/backend/services/campaign";
import { SimpleDesignItem } from "@/types/DesignItem";
import { Tag } from "@/types/Product";
import { CommonResponseBase } from "@/types/ResponseBase";
import { CURRENCIES } from "@/utils/createProductValidations";
import { getDesignItemsForCampaign } from "@/utils/localStorage/campaign";
import {
  Badge,
  Button,
  Indicator,
  Input,
  MultiSelect,
  NumberInput,
  Select,
  Stepper,
  Tabs,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
    },
  });

  const submitCampaignHandler = async () => {
    const res = await updateCampaignStatusApi(id, {
      message: "Submit to admin",
      status: "WAITING",
    });
    refetch();
  };

  const deleteCampaignHandler = async () => {
    const res = await updateCampaignStatusApi(id, {
      message: "Cancel campaign",
      status: "CANCELED",
    });
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
          <Tabs.Tab value="general-info">General info</Tabs.Tab>
          <Tabs.Tab value="custom-products">Custom products</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="general-info">
          <CampaignGeneralInfoForm
            disabled={!["DRAFT", "REQUEST_CHANGE"].includes(res.data.status)}
            data={{
              name: res.data.name,
              description: res.data.description,
              campaignHistories: res.data.campaignHistories,
            }}
          />
        </Tabs.Panel>

        <Tabs.Panel value="custom-products">
          <CustomProductForm
            disabled={!["DRAFT", "REQUEST_CHANGE"].includes(res.data.status)}
            data={customProducts}
          />
        </Tabs.Panel>
      </Tabs>
    </>
  );
}

function CampaignGeneralInfoForm({
  data,
  disabled = false,
}: {
  data: Pick<CamapignDetail, "name" | "description" | "campaignHistories">;
  disabled?: boolean;
}) {
  const queryClient = useQueryClient();
  const params = useParams();

  const id = params!.id as string;
  const form = useForm<{
    name: string;
    description?: string;
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
    queryClient.refetchQueries(["campaign", { id: params!.id as string }]);
  };

  useEffect(() => {
    form.setValues({ ...data });
  }, [data]);

  return (
    <div className="card general-wrapper mt-5">
      <h2 className="text-3xl font-bold">Campaign information</h2>
      <div className="flex gap-x-8">
        <form
          onSubmit={form.onSubmit(submitHandler)}
          className="flex flex-col gap-4 flex-[3]"
        >
          <TextInput
            disabled={disabled}
            label="Campaign name"
            {...form.getInputProps("name")}
          />
          <Textarea
            disabled={disabled}
            label="Description"
            {...form.getInputProps("description")}
          />
          <div className="flex justify-end ">
            <Button type="submit" disabled={disabled}>
              Submit
            </Button>
          </div>
        </form>
        <div className="flex-[2]">
          <Stepper active={0} orientation="vertical" size="xs">
            {data.campaignHistories.map((step) => (
              <Stepper.Step
                size="xs"
                key={step.eventTime}
                label={step.action}
                description={step.message ?? step.eventTime}
              />
            ))}
            <Stepper.Step size="xs" label="Start" />
          </Stepper>
        </div>
      </div>
    </div>
  );
}

function CustomProductForm({
  data,
  disabled = false,
}: {
  data: CamapignDetail["customProducts"];
  disabled?: boolean;
}) {
  const [customProduct, setCustomProduct] = useState<CustomProduct>(data[0]);
  const [dirtyList, setDirtyList] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const params = useParams();

  const id = params!.id as string;
  const { values, getInputProps, onSubmit, setFieldValue, isDirty } = useForm({
    initialValues: {
      customProducts: data.map((el) => ({
        inventoryItemId: el.inventoryItem.id,
        name: el.name,
        tags: el.tags,
        categoryId: el.category.id.toString(),
        description: el.description,
        quantity: el.providerConfig.minQuantity,
        price: {
          amount: el.providerConfig.basePriceAmount,
          unit: "VND",
        },
        attaches: [],
        limitPerOrder: el.limitPerOrder,
      })),
    },
    validateInputOnBlur: true,
    validateInputOnChange: true,
  });

  useEffect(() => {
    if (!customProduct) return;
    if (isDirty() && !dirtyList.includes(customProduct.id))
      setDirtyList((prev: any) => [...prev, customProduct.id]);
    else if (!isDirty() && dirtyList.includes(customProduct.id))
      setDirtyList((prev: any) =>
        prev.filter((i: any) => i !== customProduct.id)
      );
  }, [values]);

  const { data: tagList } = useTags();
  const { data: categories } = useCategories();

  const categoryOptions = categories?.data?.items?.map?.((category) => ({
    value: category.id,
    label: category.name,
  }));
  const mapTagDataToTagOption = (data: Tag[]) =>
    data?.map((tag) => ({
      value: tag.name,
      label: tag.name,
    })) ?? [];

  // FETCH TAGS FROM SERVER
  const [tags, setTags] = useState<
    {
      value: string;
      label: string;
    }[]
  >(mapTagDataToTagOption(tagList?.data.items ?? []) ?? []);

  useEffect(() => {
    setTags(mapTagDataToTagOption(tagList?.data.items ?? []) ?? []);
  }, [tagList]);

  const submitHandler = async (data: any) => {
    const campaignRes = queryClient.getQueryData<
      CommonResponseBase<CamapignDetail>
    >(["campaign", { id: params!.id as string }]);
    if (!campaignRes?.data) return;
    try {
      const res = await updateCampaignCustomProductsApi(
        {
          ...campaignRes.data,
        },
        (values?.customProducts?.map((prod) => ({
          attaches: prod.attaches,
          description: prod.description,
          inventoryItemId: prod.inventoryItemId,
          limitPerOrder: prod.limitPerOrder,
          name: prod.name,
          price: prod.price,
          quantity: prod.quantity,
          tags: prod.tags,
        })) as any) ?? []
      );
      setDirtyList([]);
      queryClient.refetchQueries(["campaign", { id: params!.id as string }]);
    } catch (e) {
      console.log("🚀 ~ file: page.tsx:153 ~ submitHandler ~ e:", e);
    }
  };

  const index = data.map((el) => el.id).indexOf(customProduct?.id ?? "");

  const { attaches = [] } = values.customProducts[index] ?? {};

  return (
    <>
      <div className="flex gap-6 mt-5">
        <div className="custom-product-list flex flex-col gap-y-6">
          {data.map((i) => (
            <Indicator
              color="red"
              size={14}
              key={i.id}
              disabled={!dirtyList.includes(i.id.toString())}
            >
              <div
                onClick={() => setCustomProduct(i)}
                className={clsx(
                  "w-20 h-20 rounded-md relative",
                  i.id === customProduct?.id ? "border border-primary " : ""
                )}
              >
                <ImageWithFallback
                  className={clsx(
                    i.id === customProduct?.id ? "border border-primary " : ""
                  )}
                  fill
                  alt="test"
                  src={""}
                />
              </div>
            </Indicator>
          ))}
        </div>
        <div className="form-wrapper flex-1">
          {customProduct && (
            <form onSubmit={onSubmit(submitHandler)}>
              <div className=" overflow-y-scroll max-h-[70vh]">
                <div className="card general-wrapper">
                  <h2 className="text-3xl font-bold">General information</h2>
                  <div className="flex flex-col-reverse md:flex-row mt-5 gap-10">
                    <div
                      className="grid grid-cols-12 w-6/12 gap-5 md:gap-x-10"
                      key={customProduct.id}
                    >
                      <TextInput
                        disabled={disabled}
                        label="Product name"
                        className="col-span-12"
                        withAsterisk
                        {...getInputProps(`customProducts.${index}.name`)}
                      />
                      <MultiSelect
                        disabled={disabled}
                        data={tags}
                        label="Tags"
                        className="col-span-12"
                        searchable
                        clearable
                        nothingFound="Nothing found"
                        classNames={{
                          values: "!mr-0",
                        }}
                        creatable
                        getCreateLabel={(query) => `+ Create ${query}`}
                        onCreate={(query) => {
                          const item = { value: query, label: query };
                          setTags((prev) => [...prev, item]);
                          return item;
                        }}
                        {...getInputProps(`customProducts.${index}.tags`)}
                      />
                      <Select
                        disabled
                        data={categoryOptions || []}
                        className="col-span-12 md:col-span-8 order-1 md:order-none"
                        label="Category"
                        nothingFound="Nothing found"
                        searchable
                        withAsterisk
                        allowDeselect
                        {...getInputProps(`customProducts.${index}.categoryId`)}
                      />
                      <NumberInput
                        disabled={disabled}
                        label="Quantity"
                        className="col-span-6 md:col-span-4"
                        withAsterisk
                        min={1}
                        {...getInputProps(`customProducts.${index}.quantity`)}
                      />

                      <Textarea
                        disabled={disabled}
                        label="Description"
                        className="col-span-12 row-span-6 order-1 md:order-none"
                        classNames={{
                          root: "flex flex-col",
                          wrapper: "flex-1",
                          input: "h-full",
                        }}
                        {...getInputProps(
                          `customProducts.${index}.description`
                        )}
                      />
                    </div>
                    <div className="image-wrapper flex flex-col md:w-6/12">
                      <div className="flex col-span-12 md:col-span-8 order-1 md:order-none">
                        <NumberInput
                          disabled={disabled}
                          label="Price"
                          withAsterisk
                          className="flex-[3]"
                          hideControls
                          classNames={{
                            input: "rounded-r-none",
                          }}
                          min={1}
                          {...getInputProps(
                            `customProducts.${index}.price.amount`
                          )}
                        />
                        <Select
                          disabled={disabled}
                          data={CURRENCIES}
                          label="Unit"
                          withAsterisk
                          className="flex-[2]"
                          classNames={{
                            input: "rounded-l-none",
                          }}
                          {...getInputProps(
                            `customProducts.${index}.price.unit`
                          )}
                        />
                      </div>
                      <NumberInput
                        disabled={disabled}
                        label="Limit per order"
                        className="col-span-6 md:col-span-4"
                        withAsterisk
                        min={1}
                        {...getInputProps(
                          `customProducts.${index}.limitPerOrder`
                        )}
                      />

                      {/* <Input.Wrapper label="Attachments" className="mt-3">
                        <div className="grid grid-cols-3 gap-3">
                          {attaches?.length < 6 && (
                            <Thumbnail
                              setFile={(file) => {
                                console.log(attaches);

                                setFieldValue(
                                  `customProducts.${index}.attaches`,
                                  [...attaches, file]
                                );
                              }}
                              addNode
                            />
                          )}
                        </div>
                      </Input.Wrapper> */}
                    </div>
                  </div>
                </div>
                <div className="card general-wrapper mt-4">
                  <h2 className="text-3xl font-bold">
                    Manufacturing information
                  </h2>
                  <div className="flex gap-x-12 mt-5">
                    <DescriptionItem
                      title="Product base"
                      content={customProduct.inventoryItem.productBase.name}
                      className="text-xl"
                    />
                  </div>
                  <div className="mt-5">
                    <div className="text-xl font-bold">Variants</div>
                    <div className="flex flex-wrap gap-x-9 mt-3">
                      {customProduct.inventoryItem.variant.variantCombination.map(
                        (combination) => {
                          return (
                            <DescriptionItem
                              key={combination.value}
                              title={combination.optionName}
                              content={combination.valueName}
                            />
                          );
                        }
                      )}
                    </div>
                  </div>
                  <div className="mt-5">
                    <div className="text-xl font-bold">Images</div>
                    <div className="flex gap-x-5">
                      {customProduct.inventoryItem.productBase.imageCombinations
                        .find(
                          (el) =>
                            el.code ===
                            customProduct.inventoryItem.combinationCode
                        )
                        ?.images.map((set) => {
                          const tmp = customProduct.inventoryItem.imageSet.find(
                            (i) => i.positionCode === set.code
                          );
                          return (
                            <div
                              className="flex flex-col gap-y-3"
                              key={set.code}
                            >
                              <span className="font-semibold text-lg">
                                {set.name}
                              </span>
                              <div className="w-96">
                                <div>Mockup</div>
                                <FileUpload
                                  disabled
                                  value={
                                    tmp?.mockupImage
                                      ? {
                                          fileName: tmp?.mockupImage?.fileName,
                                          file: tmp?.mockupImage?.id,
                                        }
                                      : undefined
                                  }
                                />
                              </div>
                              <div className="w-96">
                                <div>Manufacturing</div>
                                <FileUpload
                                  disabled
                                  value={
                                    tmp?.manufacturingImage
                                      ? {
                                          fileName:
                                            tmp?.manufacturingImage?.fileName,
                                          file: tmp?.manufacturingImage?.id,
                                        }
                                      : undefined
                                  }
                                />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex w-full justify-end mt-4">
                <Button
                  type="submit"
                  disabled={disabled || !dirtyList.length}
                  variant="outline"
                >
                  Update custom products
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

function DescriptionItem({
  className,
  title,
  content,
}: {
  className?: string;
  title: string;
  content: string;
}) {
  return (
    <span className={clsx(className)}>
      <strong>{title}: </strong>
      {content}
    </span>
  );
}
