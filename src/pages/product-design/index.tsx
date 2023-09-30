import ProductBaseCard from "@/components/Cards/ProductBaseCard/ProductBaseCard";
import axiosClient, { fetcher } from "@/services/backend/axiosClient";
import { createDesignItemApi } from "@/services/backend/services/designInventory";
import { ProductBaseDetail, SimpleProductBase } from "@/types/ProductBase";
import { SimpleProductVariant } from "@/types/ProductVariant";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { Carousel } from "@mantine/carousel";
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";

export default function ProductDesignPage() {
  const { data: response, isLoading } = useSWR<
    CommonResponseBase<PaginationResponseBase<SimpleProductBase>>
  >("/product-base", () => fetcher("/product-base"));
  const productBaseId = useRef<string>();
  const [opened, { open, close }] = useDisclosure(false);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="h-screen w-full">
      <h1>Design product</h1>
      <Modal opened={opened} onClose={close} centered>
        {productBaseId.current && (
          <ProductBaseDetailModalContent
            productBaseId={productBaseId.current}
          />
        )}
      </Modal>
      <div className="product-base-list grid grid-cols-5 gap-x-3.5">
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
      <div className="w-full flex gap-5">
        <div className="images-wrapper flex flex-col flex-[2]">
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
          </Carousel>
          <div className="size-description flex gap-x-3">
            <Image
              src={productBase?.sizeDescriptionUrl ?? ""}
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
        </div>
        <div className="description flex flex-col gap-y-3 flex-[3]">
          <h1 className="font-semibold text-3xl">{productBase?.name}</h1>
          <span>{productBase?.description}</span>
        </div>
      </div>
      {productBase && (
        <div className="w-full">
          <VariantAndProviderPicker productBase={productBase} />
        </div>
      )}
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
        params.append("optionIds", key);
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
      const res = await createDesignItemApi({
        variantId: variantId,
        name: "Untitled",
      });
      console.log("🚀 ~ file: index.tsx:168 ~ createDesignItem ~ res:", res);
      router.push(`/product-design/${res.data.data.id}`);
    } catch (e) {
      console.log("🚀 ~ file: index.tsx:169 ~ createDesignItem ~ e:", e);
    }
  };

  return (
    <div className="w-full flex flex-col gap-y-5">
      <div className="variant-picker">
        <div className="flex w-full justify-between">
          <h2 className="font-semibold">Variants</h2>
          <Button
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
          <div key={option.id} className="flex flex-col gap-y-1 mt-2">
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
        <h2 className="font-semibold">Avaialable provider</h2>
        {variantResponse?.data.items?.[0]?.providerConfigs?.map((config) => (
          <div key={config.businessCode}>
            <div className="size-description flex gap-x-3">
              <div className="w-20 aspect-square bg-primary rounded-md" />
              <div className="flex flex-col gap-y-3">
                <div className="text-2xl font-semibold">Provider name</div>
                <div>
                  <span>Manufacturing time: {config.manufacturingTime}</span> -
                  <span>Minimum quantity: {config.minQuantity}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
