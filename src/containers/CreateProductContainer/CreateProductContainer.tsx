import Thumbnail from "@/components/CreateProduct/Thumbnail";
import { ATTACHMENT_TYPE } from "@/constants/common";
import useCategories from "@/hooks/useCategories";
import useTags from "@/hooks/useTags";
import { createProduct } from "@/services/backend/services/product";
import { CreateProductValues, Tag } from "@/types/Product";
import {
  DEFAULT_FORM_VALUES,
  createProductValidation,
  CURRENCIES,
} from "@/utils/createProductValidations";
import {
  Button,
  Checkbox,
  Input,
  MultiSelect,
  NumberInput,
  Select,
  Switch,
  TextInput,
  Textarea,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import clsx from "clsx";
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

  const { publishDatetime, attaches } = values;

  const categoryOptions = categories?.data?.items?.map?.((category) => ({
    value: category.id,
    label: category.name,
  }));

  const submitHandler = async (values: CreateProductValues) => {
    if (values?.thumbnail) {
      values.attaches.push(values?.thumbnail);
      delete values.thumbnail;
    }

    if (values.allowPreOrder) {
      values.status = "PRE_ORDER";
    }
    delete values.allowPreOrder;

    if (values.allowShipping) {
      values.deliveryType = "SHIP";
    } else {
      values.deliveryType = "AT_EVENT";
    }
    delete values.allowShipping;

    setIsSubmitting(true);
    await createProduct(values);
    setIsSubmitting(false);
  };

  return (
    <form
      className="create-product-container flex flex-col gap-10 w-full pb-5"
      onSubmit={onSubmit(submitHandler)}
    >
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
                {attaches.map((attach, index) => (
                  <Thumbnail
                    // Make this unique
                    key={`${index}-${Math.random()}`}
                    setFile={(file) => {
                      setFieldValue(`attaches.${index}`, file);
                    }}
                    clearable
                    onClear={() => {
                      removeListItem("attaches", index);
                    }}
                  />
                ))}
                {attaches.length < 6 && (
                  <Thumbnail
                    setFile={(file) => {
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
      <div className="card pre-order-wrapper">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold">Pre-order information</h2>
          <Switch
            label="Allow pre-order"
            size="md"
            offLabel={<span className="text-sm">|</span>}
            onLabel={<span className="text-base">O</span>}
            {...getInputProps("allowPreOrder", {
              type: "checkbox",
            })}
            onChange={(e) => {
              getInputProps("allowPreOrder").onChange(e);
              if (!e.target.checked) {
                // For submission
                clearFieldError("preOrderRange");
                clearFieldError("publishDatetime");
              } else {
                validateField("preOrderRange");
                validateField("publishDatetime");
              }
            }}
            disabled={isSubmitting}
          />
        </div>
        <div
          className={clsx(
            "grid grid-cols-12 transition-all gap-5 md:gap-x-10"
            // allowPreOrder
            //   ? "opacity-100 mt-5"
            //   : "h-0 pointer-events-none opacity-0"
          )}
        >
          <DatePickerInput
            type="range"
            label="Pre-order date range"
            placeholder="Pick dates range"
            className="col-span-12 md:col-span-6"
            withAsterisk
            numberOfColumns={2}
            {...getInputProps("preOrderRange")}
            onChange={(value) => {
              const [start, end] = value;
              // Manual validation since does not trigger validation for other field
              if (start && end && publishDatetime && end <= publishDatetime) {
                clearFieldError("publishDatetime");
              }
              setFieldValue("preOrderRange", value);
            }}
            disabled={isSubmitting}
          />
          <DatePickerInput
            label="Release date"
            placeholder="Pick a date"
            className="col-span-12 md:col-span-6"
            withAsterisk
            {...getInputProps("publishDatetime")}
            // onChange={(value) => {
            //   const [start, end] = preOrderRange;
            //   // Manual validation since does not trigger validation for other field
            //   if (start && end && value && end <= value) {
            //     clearFieldError("preOrderRange");
            //   }
            //   setFieldValue("publishDatetime", value);
            // }}
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div className="card shipping-payment-wrapper">
        <h2 className="text-xl font-bold">Shipping & payment methods</h2>
        <Switch
          className="mt-5"
          label="Allow shipping"
          size="md"
          offLabel={<span className="text-sm">|</span>}
          onLabel={<span className="text-base">O</span>}
          {...getInputProps("allowShipping", { type: "checkbox" })}
          onChange={(e) => {
            getInputProps("allowShipping").onChange(e);
            if (e.target.checked) {
              // For submission
              clearFieldError("pickupLocation");
            } else {
              validateField("pickupLocation");
            }
          }}
          disabled={isSubmitting}
        />
        <div
          className={clsx(
            "shipping-wrapper grid grid-cols-12 gap-5 md:gap-x-10 transition-all"
            // !allowShipping
            //   ? "opacity-100 mt-5"
            //   : "h-0 pointer-events-none opacity-0"
          )}
        >
          <TextInput
            label="Pick up at"
            className="col-span-12 md:col-span-10"
            // {...getInputProps("pickupLocation")}
            // disabled={sameAsStoreAddress || isSubmitting}
          />
          <Input.Wrapper
            label="Same as my shop"
            className="col-span-12 md:col-span-2"
          >
            <Switch
              size="md"
              offLabel={<span className="text-sm">|</span>}
              onLabel={<span className="text-base">O</span>}
              // {...getInputProps("sameAsStoreAddress", {
              //   type: "checkbox",
              // })}
              // onChange={(e) => {
              //   getInputProps("sameAsStoreAddress").onChange(e);
              //   if (e.target.checked) {
              //     setFieldValue(
              //       "pickupLocation",
              //       "INSERT THE ADDRESS FROM ARTIST HERE"
              //     );
              //   } else {
              //     setFieldValue("pickupLocation", "");
              //   }
              // }}
              disabled={isSubmitting}
            />
          </Input.Wrapper>
        </div>
        <h2 className="text-xl font-bold mt-5">Payment information</h2>
        <Checkbox.Group
          className="flex flex-col gap-3 mt-5"
          {...getInputProps("paymentMethods", {
            type: "checkbox",
          })}
        >
          <Checkbox
            value="CASH"
            label="Cash on delivery"
            disabled={isSubmitting}
          />
          <Checkbox
            value="VN_PAY"
            label="Bank transfer"
            disabled={isSubmitting}
          />
        </Checkbox.Group>
      </div>
      <div className="btn-wrapper flex flex-col-reverse md:flex-row gap-5 w-full md:w-max ml-auto bg-white p-5 rounded-lg md:bg-transparent sm:p-0">
        <Button variant="outline" type="button" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button className="bg-primary" type="submit" loading={isSubmitting}>
          Publish
        </Button>
      </div>
    </form>
  );
};

export default CreateProductContainer;
