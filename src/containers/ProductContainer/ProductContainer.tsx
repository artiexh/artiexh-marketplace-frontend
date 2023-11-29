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
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
}: {
  data: ProductInventory;
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
    validate: productValidation,
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

  const submitHandler = async (
    values: Omit<Partial<ProductInventory>, "attaches"> & {
      attaches: File[];
      thumbnail: File;
    }
  ) => {
    console.log(values);
    const thumbnail = (await publicUploadFile([
      values.thumbnail,
    ])) as AxiosResponse<
      CommonResponseBase<{
        fileResponses: {
          presignedUrl: string;
          fileName: string;
        }[];
      }>,
      any
    >;

    const attachmentRes = (await publicUploadFile(
      values.attaches.filter((attachment) => attachment != null)
    )) as AxiosResponse<
      CommonResponseBase<{
        fileResponses: {
          presignedUrl: string;
          fileName: string;
        }[];
      }>,
      any
    >;

    console.log(attachmentRes);

    const { productCode, ...rest } = values;

    console.log(rest);

    const updateRes = await axiosClient.put(
      `/product-inventory/${data.productCode}`,
      {
        ...rest,
        attaches: [
          ...mapImageUrlToImageBody(thumbnail, ATTACHMENT_TYPE.THUMBNAIL),
          ...mapImageUrlToImageBody(attachmentRes, ATTACHMENT_TYPE.OTHER),
        ],
        categoryId: data.category.id,
        price: {
          amount: rest.price,
          unit: "VND",
        },
        paymentMethods: data?.paymentMethods,
        type: data?.type,
        deliveryType: "SHIP",
        status: data?.status,
        tags: values?.tags,
      }
    );

    console.log(updateRes);

    // const res = await updateGeneralInformationApi(data, {
    //   ...values,
    //   attaches: [
    //     ...(attaches as Attaches[]),
    //     ...((values.attaches?.filter(
    //       (attach) => !(attach instanceof File)
    //     ) as Attaches[]) ?? []),
    //   ],
    // });

    // queryClient.setQueryData(
    //   ["/custom-product/[id]/general", { id: data?.id }],
    //   res.data
    // );
    // const tmp = res.data.data;
    // setValues({
    //   attaches: tmp.attaches?.filter((el) => el.type !== "THUMBNAIL") ?? [],
    //   description: tmp.description,
    //   maxItemPerOrder: tmp.maxItemPerOrder,
    //   name: tmp.name,
    //   tags: tmp.tags,
    //   variantId: tmp.variant.id,
    //   thumbnail: tmp.attaches?.find((el) => el.type === "THUMBNAIL"),
    // });
    resetDirty();
  };

  return (
    <>
      <form
        className="create-product-container flex flex-col gap-5 w-full pb-5"
        onSubmit={onSubmit(submitHandler)}
      >
        <div className="card general-wrapper">
          <div className="flex gap-x-2 items-center">
            <IconArrowLeft
              className="cursor-pointer"
              onClick={() => router.push("/my-shop/products")}
            />
            <h2 className="font-bold text-xl">Product information</h2>
          </div>
        </div>
        <div className="card general-wrapper">
          <h2 className="text-xl font-bold">General information</h2>
          <div className="flex flex-col-reverse md:flex-row mt-5 gap-10">
            <div className="grid grid-cols-12 w-full gap-5 md:gap-x-10">
              <TextInput
                label="Product name"
                className="col-span-12"
                withAsterisk
                {...getInputProps("name")}
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
                {...getInputProps("tags")}
                disabled={isSubmitting}
              />
              <Select
                data={categoryOptions || []}
                className="col-span-12 md:col-span-8 order-1 md:order-none"
                label="Category"
                nothingFound="Nothing found"
                searchable
                placeholder={data.category.name}
                disabled={true}
              />
              <Textarea
                label="Description"
                className="col-span-12 row-span-6 order-1 md:order-none"
                classNames={{
                  root: "flex flex-col",
                  wrapper: "flex-1",
                  input: "h-full",
                }}
                {...getInputProps("description")}
                disabled={isSubmitting}
              />
              <TextInput
                label="Price"
                className="col-span-5"
                withAsterisk
                {...getInputProps("price")}
                disabled={isSubmitting}
              />
              <TextInput
                label="Quantity"
                className="col-span-5"
                withAsterisk
                {...getInputProps("quantity")}
                disabled={isSubmitting}
              />
              <TextInput
                label="Weight"
                className="col-span-5"
                withAsterisk
                {...getInputProps("weight")}
                disabled={isSubmitting}
              />
              <TextInput
                label="Max item per order"
                className="col-span-5"
                withAsterisk
                {...getInputProps("maxItemsPerOrder")}
                disabled={isSubmitting}
              />
            </div>
            <div className="image-wrapper flex flex-col md:w-6/12">
              <Input.Wrapper label="Thumbnail" withAsterisk>
                <Thumbnail
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
                    <div className="flex flex-col items-center">
                      <p className="text-4xl font-thin">+</p>
                      <p>Add thumbnail</p>
                    </div>
                  }
                  clearable
                  onClear={() => {
                    setFieldValue("thumbnail", undefined);
                  }}
                />
              </Input.Wrapper>
              <Input.Wrapper label="Attachments" className="mt-3">
                <div className="grid grid-cols-3 gap-3">
                  {
                    //@ts-ignore
                    values.attaches?.map((attach, index) => (
                      <Thumbnail
                        // Make this unique
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
                  {values.attaches?.length < 6 && (
                    <Thumbnail
                      setFile={(file) => {
                        console.log(attaches);
                        setFieldValue(`attaches`, [...attaches, file]);
                      }}
                      addNode
                    />
                  )}
                </div>
              </Input.Wrapper>
            </div>
          </div>
        </div>

        <div className="btn-wrapper flex flex-col-reverse md:flex-row gap-5 w-full md:w-max ml-auto bg-white p-5 rounded-lg md:bg-transparent sm:p-0">
          <Button
            className="bg-primary"
            type="submit"
            loading={isSubmitting}
            disabled={!isDirty()}
          >
            Save
          </Button>
        </div>
      </form>
    </>
  );
}
