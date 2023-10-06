import ProductBaseCard from "@/components/Cards/ProductBaseCard/ProductBaseCard";
import { fetcher } from "@/services/backend/axiosClient";
import { ProductBaseDetail, SimpleProductBase } from "@/types/ProductBase";
import { SimpleProductVariant } from "@/types/ProductVariant";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { currencyFormatter } from "@/utils/formatter";
import { Carousel } from "@mantine/carousel";
import { Button, Divider, Modal, Pagination } from "@mantine/core";
import { UseFormReturnType, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowDown, IconFilter } from "@tabler/icons-react";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import defaultImg from "../../../public/assets/default-thumbnail.jpg";
import { createDesignItemApi } from "@/services/backend/services/designInventory";
import { CategoryItem } from "@/components/ProductList";
import { MAX_CATEGORIES } from "@/constants/ProductList";
import { Category } from "@/types/Product";
import { IconArrowUp } from "@tabler/icons-react";
import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";

type SidebarProps = {
  form: UseFormReturnType<Partial<any>>;
  submitHandler: (data: Record<string, any>) => void;
  resetHandler: () => void;
};

function SideBar({ resetHandler, submitHandler }: SidebarProps) {
  const [filters, setFilter] = useState<Record<string, any>>({
    categoryId: undefined,
  });
  const [moreCategories, setMoreCategories] = useState(false);
  const { data: res, isLoading } = useSWR<
    CommonResponseBase<PaginationResponseBase<Category>>
  >("categories", () =>
    fetcher(`/category?` + new URLSearchParams({ pageSize: "100" }).toString())
  );

  return (
    <div className="col-span-3">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-xl flex items-center gap-1">
          <IconFilter />
          Bộ lọc
        </h2>
        <Button
          variant="outline"
          size="xs"
          onClick={() => {
            setFilter({ categoryId: undefined });
            resetHandler();
          }}
        >
          Xóa tất cả
        </Button>
      </div>
      {!isLoading && res && (
        <>
          <Divider className="my-3" />
          <h3 className="font-bold text-lg">Danh mục</h3>
          <div className="flex flex-col gap-3 mt-3">
            {res?.data.items.slice(0, MAX_CATEGORIES).map((category, index) => (
              <CategoryItem
                key={category.id}
                category={category}
                active={filters.categoryId === category.id}
                setActiveCategory={(id) => {
                  setFilter((prev) => ({
                    ...prev,
                    categoryId: id,
                  }));
                  submitHandler({ categoryId: id });
                }}
              />
            ))}
            {moreCategories &&
              res?.data.items.slice(MAX_CATEGORIES).map((category, i) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  active={filters.categoryId === category.id}
                  setActiveCategory={(id) => {
                    setFilter((prev) => ({
                      ...prev,
                      categoryId: id,
                    }));
                    submitHandler({ categoryId: id });
                  }}
                />
              ))}
            {res.data.totalSize > 5 && (
              <div
                className="text-subtext cursor-pointer hover:text-primary"
                onClick={() => setMoreCategories(!moreCategories)}
              >
                {moreCategories ? (
                  <span className="flex gap-1 items-center">
                    Bớt <IconArrowUp />
                  </span>
                ) : (
                  <span className="flex gap-1 items-center">
                    Thêm <IconArrowDown />
                  </span>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function ProductDesignPage() {
  const form = useForm();
  const [apiParams, setApiParams] = useState({
    pageSize: 8,
    pageNumber: 1,
    category: null,
    sortDirection: "ASC",
  });
  const {
    data: response,
    isLoading,
    mutate,
  } = useSWR<CommonResponseBase<PaginationResponseBase<SimpleProductBase>>>(
    ["/product-base", form.values, apiParams],
    () => {
      const params = new URLSearchParams();
      params.set("pageSize", apiParams.pageSize.toString());
      params.set("pageNumber", apiParams.pageNumber.toString());
      Object.keys(form.values).forEach((key) => {
        if (form.values[key]) {
          params.set(key, form.values[key] as string);
        }
      });
      return fetcher("/product-base?" + params.toString());
    }
  );

  const productBaseId = useRef<string>();
  const [opened, { open, close }] = useDisclosure(false);

  const submitHandler = (data: Record<string, string>) => {
    console.log("🚀 ~ file: index.tsx:142 ~ submitHandler ~ data:", data);
    form.setValues(data);
    mutate();
  };

  const resetHandler = () => {
    form.setValues({
      categoryId: undefined,
    });
    mutate();
  };

  return (
    <div className="h-[calc(100vh-2rem)] w-full px-10">
      <h1>Pick product base to design</h1>
      <Modal opened={opened} onClose={close} centered fullScreen>
        {productBaseId.current && (
          <ProductBaseDetailModalContent
            productBaseId={productBaseId.current}
          />
        )}
      </Modal>
      <div className="product-base-list grid grid-cols-12 gap-x-12 mt-6">
        <SideBar
          submitHandler={submitHandler}
          resetHandler={resetHandler}
          form={form}
        />
        {isLoading ? null : (
          <div className="col-span-9">
            <div className="grid grid-cols-4 gap-x-4 gap-y-5">
              {response?.data.items.map((item) => (
                <ProductBaseCard
                  data={item}
                  key={item.id}
                  onClick={() => {
                    productBaseId.current = item.id.toString();
                    open();
                  }}
                />
              ))}
            </div>
            <div className="flex justify-center mt-6 mb-20">
              <Pagination
                value={apiParams.pageNumber}
                onChange={(e) => {
                  setApiParams((prev) => ({
                    ...prev,
                    pageNumber: e,
                  }));
                }}
                total={response?.data?.totalPage ?? 0}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type ProductBaseDetailModalContentProps = {
  productBaseId: string;
};

function ProductBaseDetailModalContent({
  productBaseId,
}: ProductBaseDetailModalContentProps) {
  const { data: response, isLoading } = useSWR<
    CommonResponseBase<ProductBaseDetail>
  >(["/product-base", productBaseId], () =>
    fetcher(`/product-base/${productBaseId}`)
  );

  if (isLoading) return null;

  const productBase = response?.data;

  return (
    <div className="w-full h-full">
      <h1 className="font-bold">{response?.data.name}</h1>
      <div className="w-full flex gap-12">
        <div className="images-wrapper flex flex-col flex-1">
          <Carousel
            className="overflow-hidden rounded-lg rounded-tl-none col-span-12 md:col-span-7"
            loop
            withIndicators
            classNames={{
              indicator: "data-[active=true]:gradient bg-gray-300",
            }}
          >
            {productBase?.attaches.map((image) => (
              <Carousel.Slide key={image.id}>
                <div className="flex h-[460px] bg-white">
                  <ImageWithFallback
                    fallback="/assets/default-thumbnail.jpg"
                    src={image.url}
                    className="object-contain"
                    alt={image.title}
                    fill
                  />
                </div>
              </Carousel.Slide>
            ))}
            {!productBase?.attaches.length ? (
              <Carousel.Slide>
                <div className="flex h-[460px] bg-white">
                  <ImageWithFallback
                    fallback="/assets/default-thumbnail.jpg"
                    src={defaultImg}
                    className="object-contain"
                    fill
                    alt="default"
                  />
                </div>
              </Carousel.Slide>
            ) : null}
          </Carousel>
          <div className="size-description flex gap-x-3 mt-3">
            <ImageWithFallback
              fallback="/assets/default-thumbnail.jpg"
              src={productBase?.sizeDescriptionUrl ?? defaultImg}
              className="object-contain"
              alt="description"
              width={80}
              height={80}
            />
            <div className="flex flex-col gap-y-3">
              <div className="text-2xl font-semibold">Size information</div>
              <span>
                {productBase?.sizes.reduce(
                  (prev, cur) =>
                    prev + `${cur.label}: ${cur.number}${cur.unit}; `,
                  ""
                )}
              </span>
            </div>
          </div>
          <div className="description flex flex-col gap-y-3 mt-5">
            <span>{productBase?.description}</span>
          </div>
        </div>
        {productBase && (
          <div className="w-full flex-1">
            <VariantAndProviderPicker productBase={productBase} />
          </div>
        )}
      </div>
    </div>
  );
}

type VariantAndProviderPickerProps = {
  productBase: ProductBaseDetail;
};

function VariantAndProviderPicker({
  productBase,
}: VariantAndProviderPickerProps) {
  const router = useRouter();
  const [queryObject, setQueryObject] = useState<
    Record<string, string | undefined>
  >(
    productBase.productOptions.reduce((prev, cur) => {
      prev[cur.id.toString()] = undefined;
      return prev;
    }, {})
  );

  const {
    data: variantResponse,
    isLoading,
    mutate,
  } = useSWR<CommonResponseBase<PaginationResponseBase<SimpleProductVariant>>>(
    ["/product-variant", queryObject],
    () => {
      const params = new URLSearchParams();
      params.set("productBaseId", productBase.id.toString());
      params.set("pageSize", "100");

      Object.entries(queryObject)
        .filter(([key, value]) => value !== undefined)
        .forEach(([key, value]) => {
          params.append("optionValueIds", value as string);
        });
      return fetcher("/product-variant?" + params.toString());
    }
  );

  const { data: optionSuggestionRes } = useSWR<
    CommonResponseBase<Record<string, string[]>>
  >(["option-suggestion", productBase.id, queryObject], () => {
    const params = new URLSearchParams();
    params.set("productBaseId", productBase.id.toString());

    Object.entries(queryObject)
      .filter(([key, value]) => value !== undefined)
      .forEach(([key, value]) => {
        params.append("optionValueIds", value as string);
      });

    return fetcher("/option/active-option?" + params.toString());
  });

  const createDesignItem = async (variantId: string) => {
    try {
      const { data: res } = await createDesignItemApi({
        variantId: variantId,
        name: "Untitled",
      });
      if (res.status === 200) {
        router.push(`/product-design/${res.data.id}`);
      }
    } catch (e) {
      console.log("🚀 ~ file: index.tsx:247 ~ createDesignItem ~ e:", e);
    }
  };

  const validVariant = productBase.productOptions.every(
    (option) => option.isOptional || queryObject[option.id]
  )
    ? variantResponse?.data.items.find((variant) => {
        return variant.variantCombinations.every((combination) => {
          return (
            queryObject[combination.optionId] === combination.optionValueId
          );
        });
      })
    : undefined;

  return (
    <div className="w-full flex flex-col gap-y-5">
      <div className="variant-picker">
        <div className="flex w-full justify-between">
          <h2 className="font-semibold text-xl">Variants</h2>
          <Button
            disabled={!validVariant}
            className="text-black hover:text-white rounded-full"
            onClick={() =>
              variantResponse?.data.items?.[0] &&
              createDesignItem(variantResponse?.data.items?.[0].id.toString())
            }
          >
            Start to design!
          </Button>
        </div>
        {productBase.productOptions
          .sort((a, b) => a.id - b.id)
          .map((option) => (
            <div key={option.id} className="flex flex-col gap-y-1.5 mb-2">
              <div>
                {option.name} {option.isOptional ? "(Optional)" : null}
              </div>
              <div className="button-groups flex gap-x-2">
                {option.optionValues
                  .sort((a, b) => a.id - b.id)
                  .map((value) => (
                    <Button
                      onClick={() => {
                        if (queryObject[option.id] === value.id.toString()) {
                          setQueryObject((prev) => ({
                            ...prev,
                            [option.id]: undefined,
                          }));
                        } else {
                          setQueryObject((prev) => ({
                            ...prev,
                            [option.id]: value.id,
                          }));
                        }
                      }}
                      disabled={
                        !optionSuggestionRes?.data[option.id]?.includes(
                          value.id.toString()
                        )
                      }
                      variant={
                        queryObject[option.id] === value.id.toString()
                          ? "filled"
                          : "outline"
                      }
                      className={clsx(
                        "text-black hover:text-white rounded-full",
                        queryObject[option.id] === value.id.toString() &&
                          "!text-white bg-primary"
                      )}
                      key={value.id}
                    >
                      {value.name}
                    </Button>
                  ))}
              </div>
            </div>
          ))}
      </div>
      <div className="provider-picker">
        <h2 className="font-semibold text-xl mb-3">Avaialable provider</h2>
        <div className="flex flex-col gap-y-4">
          {validVariant?.providerConfigs?.map((config) => (
            <div key={config.businessCode}>
              <div className="size-description flex gap-x-3">
                <div className="w-20 aspect-square bg-primary rounded-md" />
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="text-lg font-semibold">Provider named</div>
                    <div className="mt-1 text-sm text-gray-400">
                      <span>
                        Manufacturing time: {config.manufacturingTime}
                      </span>{" "}
                      -<span>Minimum quantity: {config.minQuantity}</span>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <span className="font-semibold">
                      From:{" "}
                      {currencyFormatter("VND", {
                        amount: config.basePriceAmount,
                        unit: "VND",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
