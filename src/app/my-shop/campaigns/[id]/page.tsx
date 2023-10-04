"use client";

import Thumbnail from "@/components/CreateProduct/Thumbnail";
import useCategories from "@/hooks/useCategories";
import useTags from "@/hooks/useTags";
import { createCampaignApi } from "@/services/backend/services/campaign";
import { SimpleDesignItem } from "@/types/DesignItem";
import { Tag } from "@/types/Product";
import { CURRENCIES } from "@/utils/createProductValidations";
import { getDesignItemsForCampaign } from "@/utils/localStorage/campaign";
import {
  Button,
  Indicator,
  Input,
  MultiSelect,
  NumberInput,
  Select,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import clsx from "clsx";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CampaignDetailPage() {
  const router = useRouter();
  const params = useParams();

  const { id } = params;

  const [customProduct, setCustomProduct] = useState<SimpleDesignItem>();
  const [dirtyList, setDirtyList] = useState<string[]>([]);
  console.log(
    "🚀 ~ file: page.tsx:31 ~ CampaignDetailPage ~ dirtyList:",
    dirtyList
  );

  const designItems = getDesignItemsForCampaign(id);
  console.log(
    "🚀 ~ file: page.tsx:13 ~ CampaignDetailPage ~ designItems:",
    designItems
  );

  return (
    <div className="flex gap-6">
      <div className="custom-product-list flex flex-col gap-y-6">
        {designItems.map((i) => (
          <Indicator
            color="red"
            size={14}
            key={i.id}
            disabled={!dirtyList.includes(i.id.toString())}
          >
            <div
              onClick={() => setCustomProduct(i)}
              className={clsx(
                "w-20 h-20 rounded-md",
                i.id === customProduct?.id ? "bg-primary" : "bg-gray-600"
              )}
            ></div>
          </Indicator>
        ))}
      </div>
      <div className="form-wrapper flex-1">
        {designItems && (
          <CustomProductForm
            data={designItems}
            customProduct={customProduct}
            dirtyList={dirtyList}
            setDirtyList={setDirtyList}
          />
        )}
      </div>
    </div>
  );
}

function CustomProductForm({
  data,
  dirtyList,
  setDirtyList,
  customProduct,
}: {
  data: SimpleDesignItem[];
  dirtyList: any;
  setDirtyList: any;
  customProduct?: SimpleDesignItem;
}) {
  const form = useForm({
    initialValues: {
      customProducts: data.map((el) => ({
        inventoryItemId: el.id,
        name: el.name,
        price: {},
      })),
    },
    validateInputOnBlur: true,
    validateInputOnChange: true,
  });

  const {
    values,
    getInputProps,
    onSubmit,
    validateField,
    setFieldValue,
    clearFieldError,
    errors,
    removeListItem,
    isDirty,
    isTouched,
  } = form;

  useEffect(() => {
    if (form.isDirty() && !dirtyList.includes(data.id))
      setDirtyList((prev) => [...prev, data.id]);
    else if (!form.isDirty() && dirtyList.includes(data.id))
      setDirtyList((prev) => prev.filter((i) => i !== data.id));
  }, [form]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: tagList } = useTags();
  const { data: categories } = useCategories();

  const router = useRouter();

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
    console.log("🚀 ~ file: page.tsx:147 ~ data:", data);
    try {
      const res = await createCampaignApi({
        ...data,
        providerId: "1234567891",
      });
      router.push(`/my-shop/campaigns`);
    } catch (e) {
      console.log("🚀 ~ file: page.tsx:153 ~ submitHandler ~ e:", e);
    }
  };

  if (!customProduct) return;

  const index = data.map((el) => el.id).indexOf(customProduct.id);

  if (index === -1) return null;

  const { attaches = [] } = form.values.customProducts[index];

  return (
    <>
      <form onSubmit={onSubmit(submitHandler)}>
        <div key={customProduct.id} className="card general-wrapper">
          <h2 className="text-xl font-bold">General information</h2>
          <div className="flex flex-col-reverse md:flex-row mt-5 gap-10">
            <div className="grid grid-cols-12 w-full gap-5 md:gap-x-10">
              <TextInput
                label="Product name"
                className="col-span-12"
                withAsterisk
                {...getInputProps(`customProducts.${index}.name`)}
                disabled={isSubmitting}
              />
              <MultiSelect
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
                disabled={isSubmitting}
              />
              <NumberInput
                label="Quantity"
                className="col-span-6 md:col-span-4"
                withAsterisk
                min={1}
                {...getInputProps(`customProducts.${index}.quantity`)}
                disabled={isSubmitting}
              />
              <div className="flex col-span-12 md:col-span-8 order-1 md:order-none">
                <NumberInput
                  label="Price"
                  withAsterisk
                  className="flex-[3]"
                  hideControls
                  classNames={{
                    input: "rounded-r-none",
                  }}
                  min={1}
                  {...getInputProps(`customProducts.${index}.price.amount`)}
                  disabled={isSubmitting}
                />
                <Select
                  data={CURRENCIES}
                  label="Unit"
                  withAsterisk
                  className="flex-[2]"
                  classNames={{
                    input: "rounded-l-none",
                  }}
                  {...getInputProps(`customProducts.${index}.price.unit`)}
                  disabled={isSubmitting}
                />
              </div>
              <NumberInput
                label="Limit per order"
                className="col-span-6 md:col-span-4"
                withAsterisk
                min={1}
                {...getInputProps(`customProducts.${index}.limitPerOrder`)}
                disabled={isSubmitting}
              />
              <Select
                data={categoryOptions || []}
                className="col-span-12 md:col-span-8 order-1 md:order-none"
                label="Category"
                nothingFound="Nothing found"
                searchable
                withAsterisk
                allowDeselect
                {...getInputProps(`customProducts.${index}.productCategoryId`)}
                disabled={isSubmitting}
              />
              <Textarea
                label="Description"
                className="col-span-12 row-span-6 order-1 md:order-none"
                classNames={{
                  root: "flex flex-col",
                  wrapper: "flex-1",
                  input: "h-full",
                }}
                {...getInputProps(`customProducts.${index}.description`)}
                disabled={isSubmitting}
              />
            </div>
            <div className="image-wrapper flex flex-col md:w-6/12">
              <Input.Wrapper label="Attachments" className="mt-3">
                <div className="grid grid-cols-3 gap-3">
                  {attaches?.length < 6 && (
                    <Thumbnail
                      setFile={(file) => {
                        console.log(attaches);

                        setFieldValue(`customProducts.${index}.attaches`, [
                          ...attaches,
                          file,
                        ]);
                      }}
                      addNode
                    />
                  )}
                </div>
              </Input.Wrapper>
            </div>
          </div>
        </div>
        <div className="flex w-full justify-end mt-4">
          <Button type="submit" className="!text-white">
            Submit
          </Button>
        </div>
      </form>
    </>
  );
}
