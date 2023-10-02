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
import { Button, Modal, Pagination } from "@mantine/core";
import { UseFormReturnType, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconFilter } from "@tabler/icons-react";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import defaultImg from "../../../public/assets/default-thumbnail.jpg";
import { createDesignItemApi } from "@/services/backend/services/designInventory";

type SidebarProps = {
  form: UseFormReturnType<Partial<any>>;
  submitHandler: (filters?: Object) => void;
  resetHandler: () => void;
};

function SideBar({ resetHandler }: SidebarProps) {
  return (
    <div className="col-span-3">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-xl flex items-center gap-1">
          <IconFilter />
          Bộ lọc
        </h2>
        <Button variant="outline" size="xs" onClick={resetHandler}>
          Xóa tất cả
        </Button>
      </div>
    </div>
  );
}

export default function ProductDesignPage() {
  const { data: response, isLoading } = useSWR<
    CommonResponseBase<PaginationResponseBase<SimpleProductBase>>
  >("/product-base", () => fetcher("/product-base"));
  const router = useRouter();
  const productBaseId = useRef<string>();
  const [opened, { open, close }] = useDisclosure(false);
  const [params, setParams] = useState({
    pageSize: 8,
    pageNumber: 1,
    category: null,
    sortDirection: "ASC",
  });
  const form = useForm();

  const submitHandler = () => {};

  const resetHandler = () => {};

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="h-[calc(100vh-2rem)] w-full px-10">
      <h1>Pick product base to design</h1>
      <Modal opened={opened} onClose={close} centered>
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
                  <Image
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
                  <Image
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
            <Image
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
  const [queryObject, setQueryObject] = useState<Record<string, string>>({});
  console.log("🚀 ~ file: index.tsx:135 ~ queryObject:", queryObject);

  const {
    data: variantResponse,
    isLoading,
    mutate,
  } = useSWR<CommonResponseBase<PaginationResponseBase<SimpleProductVariant>>>(
    "/product-variant",
    () => {
      const params = new URLSearchParams();
      params.set("productBaseId", productBase.id.toString());

      Object.entries(queryObject).forEach(([key, value]) => {
        params.append("optionValueIds", value);
      });
      console.log("🚀 ~ file: index.tsx:145 ~ params:", params);
      return fetcher("/product-variant?" + params.toString());
    }
  );

  useEffect(() => {
    mutate();
  }, [queryObject]);

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

  return (
    <div className="w-full flex flex-col gap-y-5">
      <div className="variant-picker">
        <div className="flex w-full justify-between">
          <h2 className="font-semibold text-xl">Variants</h2>
          <Button
            disabled={variantResponse?.data.totalSize === 0}
            className="text-black hover:text-white rounded-full"
            onClick={() =>
              variantResponse?.data.items?.[0] &&
              createDesignItem(variantResponse?.data.items?.[0].id.toString())
            }
          >
            Start to design!
          </Button>
        </div>
        {productBase.productOptions.map((option) => (
          <div key={option.id} className="flex flex-col gap-y-1.5 mb-2">
            <div>
              {option.name} {option.isOptional ? "(Optional)" : null}
            </div>
            <div className="button-groups flex gap-x-2">
              {option.optionValues.map((value) => (
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
                  className={clsx(
                    "text-black hover:text-white rounded-full",
                    queryObject[option.id] === value.id.toString() &&
                      "text-white bg-black"
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
        {variantResponse?.data.items?.[0]?.providerConfigs?.map((config) => (
          <div key={config.businessCode}>
            <div className="size-description flex gap-x-3">
              <div className="w-20 aspect-square bg-primary rounded-md" />
              <div className="flex flex-col justify-between">
                <div>
                  <div className="text-lg font-semibold">Provider named</div>
                  <div className="mt-1 text-sm text-gray-400">
                    <span>Manufacturing time: {config.manufacturingTime}</span>{" "}
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
  );
}
