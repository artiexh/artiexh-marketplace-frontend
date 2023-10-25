import Thumbnail from "@/components/CreateProduct/Thumbnail";
import { ATTACHMENT_TYPE, NOTIFICATION_TYPE } from "@/constants/common";
import { ROUTE } from "@/constants/route";
import useCategories from "@/hooks/useCategories";
import useTags from "@/hooks/useTags";
import { publicUploadFile } from "@/services/backend/services/media";
import { createProduct } from "@/services/backend/services/product";
import { CreateProductValues, Tag } from "@/types/Product";
import {
  CURRENCIES,
  DEFAULT_FORM_VALUES,
  createProductValidation,
} from "@/utils/createProductValidations";
import { getNotificationIcon } from "@/utils/mapper";
import {
  Button,
  Input,
  MultiSelect,
  NumberInput,
  Select,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CreateProductContainer = () => {
  const { data: categories } = useCategories();
  const { data: tagList } = useTags();

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
  } = useForm({
    initialValues: DEFAULT_FORM_VALUES,
    validate: createProductValidation,
    validateInputOnBlur: true,
    validateInputOnChange: true,
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

  const submitHandler = async (values: CreateProductValues) => {
    if (values.allowShipping) {
      values.deliveryType = "SHIP";
    } else {
      values.deliveryType = "AT_EVENT";
    }
    delete values.allowShipping;

    if (!values.thumbnail) {
      notifications.show({
        message: "Xin hãy upload ảnh sản phẩm của bạn",
        ...getNotificationIcon(NOTIFICATION_TYPE["FAILED"]),
      });
      return;
    }

    const promiseArr = [publicUploadFile([values.thumbnail])];

    if (values.attaches.filter((item) => item != null).length > 0) {
      promiseArr.push(publicUploadFile(values.attaches ?? []));
    }

    Promise.all(promiseArr)
      .then(async (res) => {
        const thumbnail = res[0]?.data.data.fileResponses[0];
        const attachments = res[1]?.data.data.fileResponses;

        if (!thumbnail) return;

        let attaches = [
          {
            url: thumbnail.presignedUrl,
            type: ATTACHMENT_TYPE.THUMBNAIL,
            title: thumbnail.fileName,
            description: thumbnail.fileName,
          },
        ] as any[];

        if (attachments != null) {
          attaches = [
            ...attaches,
            ...attachments?.map((attachment) => ({
              url: attachment.presignedUrl,
              type: ATTACHMENT_TYPE.OTHER,
              title: attachment.fileName,
              description: attachment.fileName,
            })),
          ];
        }

        const result = await createProduct({
          ...values,
          attaches,
        });

        if (result?.data.data == null) {
          notifications.show({
            message: "Tao sản phẩm thất bại! Xin hãy thử lại!",
            ...getNotificationIcon(NOTIFICATION_TYPE["FAILED"]),
          });
        } else {
          notifications.show({
            message: "Tao sản phẩm thành công!",
            ...getNotificationIcon(NOTIFICATION_TYPE["SUCCESS"]),
          });
          router.push(`${ROUTE.SHOP}/products`);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
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
            <NumberInput
              label="Quantity"
              className="col-span-6 md:col-span-4"
              withAsterisk
              min={1}
              {...getInputProps("remainingQuantity")}
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
                {...getInputProps("price.amount")}
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
                {...getInputProps("price.unit")}
                disabled={isSubmitting}
              />
            </div>
            <NumberInput
              label="Limit per order"
              className="col-span-6 md:col-span-4"
              withAsterisk
              min={1}
              {...getInputProps("maxItemsPerOrder")}
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
              {...getInputProps("categoryId")}
              disabled={isSubmitting}
            />
            <NumberInput
              label="Weight"
              className="col-span-12"
              withAsterisk
              min={1}
              {...getInputProps("weight")}
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
              {...getInputProps("description")}
              disabled={isSubmitting}
            />
          </div>
          <div className="image-wrapper flex flex-col md:w-6/12">
            <Input.Wrapper label="Thumbnail" withAsterisk>
              <Thumbnail
                setFile={(file) => {
                  setFieldValue("thumbnail", file);
                }}
                error={errors.thumbnail as string}
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
                {attaches?.map((attach, index) => (
                  <Thumbnail
                    // Make this unique
                    url={URL.createObjectURL(attach)}
                    key={`${index}-${attach.name}-${Math.random()}`}
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
                {attaches?.length < 6 && (
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

export default CreateProductContainer;
