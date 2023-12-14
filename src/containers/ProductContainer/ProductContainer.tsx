import Thumbnail from "@/components/CreateProduct/Thumbnail";
import { ATTACHMENT_TYPE } from "@/constants/common";
import useCategories from "@/hooks/useCategories";
import useTags from "@/hooks/useTags";
import axiosClient from "@/services/backend/axiosClient";
import { publicUploadFile } from "@/services/backend/services/media";
import { ProductInventory, Tag } from "@/types/Product";
import { CommonResponseBase } from "@/types/ResponseBase";
import { Attaches } from "@/types/common";
import { mapImageUrlToImageBody } from "@/utils/mapper";
import { productValidation } from "@/validation/product";
import {
  TextInput,
  MultiSelect,
  Select,
  Textarea,
  Input,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import clsx from "clsx";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";

type UpdateGeneralInfoData = {
  attaches: (Attaches | File)[];
  description: string;
  maxItemPerOrder: number;
  name: string;
  tags: string[];
  variantId: string;
  thumbnail?: Attaches | File;
};

export default function ProductDetailContainer({
  data,
  editable = true,
}: {
  data: ProductInventory;
  editable?: boolean;
}) {
  const { data: categories } = useCategories();
  const { data: tagList } = useTags();
  const queryClient = useQueryClient();
  const params = useParams();

  const {
    values,
    getInputProps,
    onSubmit,
    setValues,
    isDirty,
    resetDirty,
    setFieldValue,
    removeListItem,
  } = useForm<any>({
    initialValues: {
      attaches: data.attaches?.filter((el) => el.type !== "THUMBNAIL") ?? [
        { file: null },
      ],
      description: data.description,
      maxItemPerOrder: data.maxItemsPerOrder,
      name: data.name,
      tags: data.tags,
      thumbnail: data.attaches?.find((el) => el.type === "THUMBNAIL"),
      quantity: data.quantity,
      maxItemsPerOrder: data.maxItemsPerOrder,
      price: data.price.amount,
      weight: data.weight,
    },
    validateInputOnBlur: true,
    validateInputOnChange: true,
    validate: editable ? productValidation : undefined,
  });

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

  const { attaches } = values;
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryOptions = categories?.data?.items?.map?.((category) => ({
    value: category.id,
    label: category.name,
  }));

  return (
    <>
      <form className="create-product-container flex flex-col gap-5 w-full pb-5">
        <div className="card general-wrapper">
          <div className="flex gap-x-2 items-center">
            <IconArrowLeft
              className="cursor-pointer"
              onClick={() => router.push("/my-shop/products")}
            />
            <h2 className="font-bold text-xl">Thông tin sản phẩm</h2>
          </div>
        </div>
        <div className="card general-wrapper">
          <h2 className="text-xl font-bold">Thông tin cơ bản</h2>
          <div className="flex flex-col-reverse md:flex-row mt-5 gap-10">
            <div className="grid grid-cols-12 w-full gap-5 md:gap-x-10">
              <TextInput
                readOnly={!editable}
                label="Tên sản phẩm"
                className="col-span-12"
                withAsterisk
                {...getInputProps("name")}
                disabled={isSubmitting}
              />
              <MultiSelect
                readOnly={!editable}
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
                {...getInputProps("tags")}
                disabled={isSubmitting}
              />
              <Select
                data={categoryOptions || []}
                className="col-span-12 md:col-span-12 order-1 md:order-none"
                label="Loại sản phẩm"
                nothingFound="Nothing found"
                searchable
                placeholder={data.category.name}
                disabled={true}
              />
              <Textarea
                readOnly={!editable}
                label="Mô tả sản phẩm"
                className="col-span-12 row-span-6 order-1 md:order-none"
                classNames={{
                  root: "flex flex-col",
                  wrapper: "flex-1",
                  input: "h-full",
                }}
                {...getInputProps("description")}
                disabled={isSubmitting}
              />
              <Input.Wrapper
                classNames={{
                  label: "w-full",
                }}
                className="col-span-5"
                label="Giá bán"
              >
                <div className="w-full col-span-5">
                  <CurrencyInput
                    readOnly={!editable}
                    id="input-example"
                    name="input-name"
                    placeholder="Please enter a number"
                    decimalsLimit={3}
                    className={clsx(
                      "w-full border rounded-lg border-[#ced4da] !leading-[calc(2.25rem-0.125rem)] px-3 !font-[inherit] !text-sm mb-1"
                    )}
                    value={values.price}
                  />
                </div>
              </Input.Wrapper>

              <TextInput
                readOnly={!editable}
                label="Số lượng"
                className="col-span-5"
                withAsterisk
                {...getInputProps("quantity")}
                disabled={isSubmitting}
              />
              <TextInput
                readOnly={!editable}
                label="Cân nặng (gram)"
                className="col-span-5"
                withAsterisk
                {...getInputProps("weight")}
                disabled={isSubmitting}
              />
              <TextInput
                readOnly={!editable}
                label="Số lượng tối đa mỗi đơn hàng"
                className="col-span-5"
                withAsterisk
                {...getInputProps("maxItemsPerOrder")}
                disabled={isSubmitting}
              />
            </div>
            <div className="image-wrapper flex flex-col md:w-6/12">
              <Input.Wrapper label="Hình ảnh chính" withAsterisk>
                <Thumbnail
                  disabled={!editable}
                  url={
                    //@ts-ignore
                    values.thumbnail?.url ??
                    (values.thumbnail
                      ? URL.createObjectURL(values.thumbnail as Blob)
                      : undefined)
                  }
                  setFile={(file) => {
                    setFieldValue("thumbnail", file);
                  }}
                  defaultPlaceholder={
                    editable ? (
                      <div className="flex flex-col items-center">
                        <p className="text-4xl font-thin">+</p>
                        <p>Tải ảnh</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <p className="text-4xl font-thin">Không có hình ảnh</p>
                      </div>
                    )
                  }
                  clearable
                  onClear={() => {
                    setFieldValue("thumbnail", undefined);
                  }}
                />
              </Input.Wrapper>
              <Input.Wrapper label="Hình ảnh kèm" className="mt-3">
                <div className="grid grid-cols-3 gap-3">
                  {
                    //@ts-ignore
                    values.attaches?.map((attach, index) => (
                      <Thumbnail
                        // Make this unique
                        disabled={!editable}
                        url={
                          //@ts-ignore
                          attach?.url ??
                          (attach
                            ? URL.createObjectURL(attach as Blob)
                            : undefined)
                        }
                        //@ts-ignore
                        key={`${index}-${attach?.name}-${Math.random()}`}
                        setFile={(file) => {
                          const cloneAttaches = [...attaches];
                          cloneAttaches[index] = file;
                          console.log(attaches, cloneAttaches);
                          setFieldValue(`attaches`, cloneAttaches);
                        }}
                        clearable
                        onClear={() => {
                          removeListItem("attaches", index);
                        }}
                      />
                    ))
                  }
                  {!values.attaches?.length && (
                    <Thumbnail
                      disabled
                      defaultPlaceholder={
                        <div className="flex flex-col items-center">
                          <p className=" font-thin text-center">
                            Không có hình ảnh
                          </p>
                        </div>
                      }
                    />
                  )}
                </div>
              </Input.Wrapper>
            </div>
          </div>
        </div>

        <div className="btn-wrapper flex flex-col-reverse md:flex-row gap-5 w-full md:w-max ml-auto bg-white p-5 rounded-lg md:bg-transparent sm:p-0">
          {editable && (
            <Button
              className="bg-primary"
              type="submit"
              loading={isSubmitting}
              disabled={!isDirty()}
            >
              Save
            </Button>
          )}
        </div>
      </form>
    </>
  );
}
