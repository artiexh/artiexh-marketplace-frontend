import Thumbnail from "@/components/CreateProduct/Thumbnail";
import useCategories from "@/hooks/useCategories";
import useTags from "@/hooks/useTags";
import { updateGeneralInformationApi } from "@/services/backend/services/customProduct";
import { publicUploadFile } from "@/services/backend/services/media";
import { CustomProductGeneralInfo } from "@/types/CustomProduct";
import { Tag } from "@/types/Product";
import { Attaches } from "@/types/common";
import { customProductValidation } from "@/validation/customProducts";
import {
  Button,
  Input,
  MultiSelect,
  Select,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  data: CustomProductGeneralInfo;
};

export type UpdateGeneralInfoData = {
  attaches: (Attaches | File)[];
  description: string;
  maxItemPerOrder: number;
  name: string;
  tags: string[];
  variantId: string;
  thumbnail?: Attaches | File;
};

const CustomProductDetailContainer = ({ data }: Props) => {
  const { data: categories } = useCategories();
  const { data: tagList } = useTags();
  const queryClient = useQueryClient();

  const {
    values,
    getInputProps,
    onSubmit,
    setValues,
    isDirty,
    resetDirty,
    setFieldValue,
    removeListItem,
  } = useForm<UpdateGeneralInfoData>({
    initialValues: {
      attaches: data.attaches?.filter((el) => el.type !== "THUMBNAIL") ?? [],
      description: data.description,
      maxItemPerOrder: data.maxItemPerOrder,
      name: data.name,
      tags: data.tags,
      variantId: data.variant.id,
      thumbnail: data.attaches?.find((el) => el.type === "THUMBNAIL"),
    },
    validateInputOnBlur: true,
    validateInputOnChange: true,
    validate: customProductValidation,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const categoryOptions = categories?.data?.items?.map?.((category) => ({
    value: category.id,
    label: category.name,
  }));

  const submitHandler = async (values: UpdateGeneralInfoData) => {
    const needToUploadArr = values.attaches?.filter(
      (attach) => attach instanceof File
    ) as File[] | undefined;

    const uploadArr =
      values.thumbnail instanceof File
        ? [values.thumbnail, ...(needToUploadArr ?? [])]
        : [...(needToUploadArr ?? [])];

    const results = uploadArr.length
      ? await publicUploadFile(uploadArr)
      : undefined;

    const attaches =
      results?.data.data.fileResponses.map((res, index) => {
        return {
          title: res.fileName,
          type: index === 0 ? "THUMBNAIL" : "OTHER",
          url: res.presignedUrl,
        };
      }) ?? [];

    const res = await updateGeneralInformationApi(data, {
      ...values,
      attaches: [
        ...(attaches as Attaches[]),
        ...((values.attaches?.filter(
          (attach) => !(attach instanceof File)
        ) as Attaches[]) ?? []),
      ],
    });
    queryClient.setQueryData(
      ["/custom-product/[id]/general", { id: data?.id }],
      res.data
    );
    const tmp = res.data.data;
    setValues({
      attaches: tmp.attaches?.filter((el) => el.type !== "THUMBNAIL") ?? [],
      description: tmp.description,
      maxItemPerOrder: tmp.maxItemPerOrder,
      name: tmp.name,
      tags: tmp.tags,
      variantId: tmp.variant.id,
      thumbnail: tmp.attaches?.find((el) => el.type === "THUMBNAIL"),
    });
    resetDirty();
  };

  return (
    <form
      className="create-product-container flex flex-col gap-5 w-full pb-5"
      onSubmit={onSubmit(submitHandler)}
    >
      <div className="card general-wrapper">
        <div className="flex gap-x-2 items-center">
          <IconArrowLeft
            className="cursor-pointer"
            onClick={() => router.push("/my-shop/custom-products")}
          />
          <h2 className="font-bold text-xl">Custom product information</h2>
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
                {values.attaches?.map((attach, index) => (
                  <Thumbnail
                    // Make this unique
                    url={
                      //@ts-ignore
                      attach?.url ??
                      (attach ? URL.createObjectURL(attach as Blob) : undefined)
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
                ))}
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
  );
};

export default CustomProductDetailContainer;
