import Thumbnail from "@/components/CreateProduct/Thumbnail";
import { NOTIFICATION_TYPE } from "@/constants/common";
import useCategories from "@/hooks/useCategories";
import useTags from "@/hooks/useTags";
import { updateGeneralInformationApi } from "@/services/backend/services/customProduct";
import { publicUploadFile } from "@/services/backend/services/media";
import { CustomProductGeneralInfo } from "@/types/CustomProduct";
import { Tag } from "@/types/Product";
import { Attaches } from "@/types/common";
import { errorHandler } from "@/utils/errorHandler";
import { getNotificationIcon } from "@/utils/mapper";
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
import { notifications } from "@mantine/notifications";
import { IconArrowLeft } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
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
    errors,
  } = useForm<UpdateGeneralInfoData>({
    initialValues: {
      attaches: data.attaches?.filter((el) => el.type !== "THUMBNAIL") ?? [],
      description: data.description,
      maxItemPerOrder: data.maxItemPerOrder,
      name: data.name,
      tags: data.tags ?? [],
      variantId: data.variant.id,
      thumbnail: data.attaches?.find((el) => el.type === "THUMBNAIL"),
    },
    validateInputOnBlur: true,
    validateInputOnChange: true,
    validate: customProductValidation,
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

  const categoryOptions = categories?.data?.items?.map?.((category) => ({
    value: category.id,
    label: category.name,
  }));

  const updateCustomProductMutation = useMutation({
    mutationFn: async (values: UpdateGeneralInfoData) => {
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

      return res.data;
    },
    onSuccess: (returnData) => {
      notifications.show({
        message: "Cập nhật thông tin sản phẩm thành công",
        ...getNotificationIcon(NOTIFICATION_TYPE.SUCCESS),
      });
      const tmp = returnData.data;
      setValues({
        attaches: tmp.attaches?.filter((el) => el.type !== "THUMBNAIL") ?? [],
        description: tmp.description,
        maxItemPerOrder: tmp.maxItemPerOrder,
        name: tmp.name,
        tags: tmp?.tags ?? [],
        variantId: tmp.variant.id,
        thumbnail: tmp.attaches?.find((el) => el.type === "THUMBNAIL"),
      });
      resetDirty();
      queryClient.setQueryData(
        ["/custom-product/[id]/general", { id: data?.id }],
        returnData
      );
    },
    onError: (e) => {
      errorHandler(e);
    },
  });

  return (
    <form
      className="create-product-container flex flex-col gap-5 w-full pb-5"
      onSubmit={onSubmit((values) =>
        updateCustomProductMutation.mutate(values)
      )}
    >
      <div className="card general-wrapper flex justify-between">
        <div className="flex gap-x-2 items-center">
          <IconArrowLeft
            className="cursor-pointer"
            onClick={() => router.push("/my-shop/custom-products")}
          />
          <h2 className="font-bold text-xl">Thông tin thiết kế</h2>
        </div>
        <div>
          <Button
            variant="outline"
            onClick={() =>
              router.push(`/my-shop/custom-products/${data.id}/design`)
            }
          >
            Thay đổi thiết kế
          </Button>
        </div>
      </div>
      <div className="card general-wrapper">
        <h2 className="text-xl font-bold">Thông tin cơ bản</h2>
        <div className="flex flex-col-reverse md:flex-row mt-5 gap-10">
          <div className="grid grid-cols-12 w-full gap-5 md:gap-x-10">
            <TextInput
              label="Tên thiết kế"
              className="col-span-12"
              withAsterisk
              {...getInputProps("name")}
              disabled={updateCustomProductMutation.isLoading}
            />
            <MultiSelect
              data={Array.from(new Set([...tags, ...values.tags]))}
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
              value={values.tags}
              disabled={updateCustomProductMutation.isLoading}
            />
            <Select
              data={categoryOptions || []}
              className="col-span-12 md:col-span-12 order-1 md:order-none"
              label="Loại"
              nothingFound="Nothing found"
              searchable
              placeholder={data.category.name}
              disabled={true}
            />
            <Textarea
              label="Mô tả"
              className="col-span-12 row-span-6 order-1 md:order-none"
              classNames={{
                root: "flex flex-col",
                wrapper: "flex-1",
                input: "h-full",
              }}
              {...getInputProps("description")}
              disabled={updateCustomProductMutation.isLoading}
            />
          </div>
          <div className="image-wrapper flex flex-col md:w-6/12">
            <Input.Wrapper label="Hình ảnh chính" withAsterisk>
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
                    <p>Tải ảnh</p>
                  </div>
                }
                clearable
                onClear={() => {
                  setFieldValue("thumbnail", undefined);
                }}
              />
            </Input.Wrapper>
            <Input.Wrapper label="Hình ảnh phụ" className="mt-3">
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
          className="bg-primary !text-white"
          type="submit"
          loading={updateCustomProductMutation.isLoading}
          disabled={!isDirty()}
        >
          Lưu
        </Button>
      </div>
    </form>
  );
};

export default CustomProductDetailContainer;
