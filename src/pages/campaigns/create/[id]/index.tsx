import ProvidedProductBaseCard, {
  CollectionProductBase,
  ProvidedProductBase,
} from "@/components/Cards/ProvidedProductBaseCard/ProvidedProductBaseCard";
import {
  DesignItem,
  getDesignItemsFromLocalStorage,
  setDesignItemsToLocalStorage,
} from "@/utils/localStorage/designProduct";
import { Button, Input, Select } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import clsx from "clsx";
import { useRouter } from "next/router";

const fakeData: (ProvidedProductBase | CollectionProductBase)[] = [
  {
    description: "This is description hellu hellu",
    id: "1",
    minPrice: { value: 1000000, unit: "VND" },
    name: "Tote bag",
    thumbnail: "/assets/carue.png",
    type: "SINGLE",
    model: "TOTE_BAG",
  },
  {
    description: "This is description hellu hellu",
    id: "2",
    minPrice: { value: 1000000, unit: "VND" },
    name: "T-SHIRT",
    thumbnail: "/assets/carue.png",
    type: "SINGLE",
    model: "T_SHIRT",
  },
  {
    description: "This is description hellu hellu",
    id: "3",
    minPrice: { value: 10000000, unit: "VND" },
    name: "Collection 1",
    thumbnail: "/assets/carue.png",
    type: "COLLECTION",
    items: [
      {
        description: "This is description hellu hellu",
        id: "1",
        minPrice: { value: 1000000, unit: "VND" },
        name: "Tote bag",
        thumbnail: "/assets/carue.png",
        type: "SINGLE",
        model: "TOTE_BAG",
      },
      {
        description: "This is description hellu hellu",
        id: "2",
        minPrice: { value: 1000000, unit: "VND" },
        name: "T-SHIRT",
        thumbnail: "/assets/carue.png",
        type: "SINGLE",
        model: "T_SHIRT",
      },
    ],
  },
];

export default function CampaignsPage() {
  const router = useRouter();
  return (
    <div className="max-w-[1280px] mx-auto flex flex-col gap-y-4 h-screen justify-center">
      <div className="header flex justify-between px-6 py-3 items-center bg-white rounded-md">
        <div className="left-side flex gap-x-3 items-center">
          <img
            src="/assets/carue.png"
            className="w-14 aspect-square rounded-full"
          />
          <span className="text-2xl">Provider name</span>
        </div>
        <div className="right-side">
          <Button
            className="text-black hover:text-white"
            onClick={() => router.push("/campaigns/create/1/details")}
          >
            Start to design!
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-y-4">
        <div className="search-section flex gap-x-2.5">
          <Input
            placeholder="kiếm cái nịt"
            icon={<IconSearch className="w-5" />}
            className="flex-1"
          />
          <Select
            placeholder="Product category"
            data={[
              { label: "Tote bag", value: "TOTE_BAG" },
              { label: "T-shirt", value: "T_SHIRT" },
            ]}
          />
          <Select
            placeholder="Product type"
            data={[
              { label: "Single product", value: "SINGLE" },
              { label: "Collection", value: "COLLECTION" },
            ]}
          />
        </div>
        <div
          className={clsx(
            "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 xl:gap-x-6",
            "product-base-list col-span-4 lg:mt-10"
          )}
        >
          {fakeData?.map((product, index) => (
            <ProvidedProductBaseCard
              data={product}
              key={index}
              actions={
                <div className="w-full flex justify-between">
                  <Button
                    className="text-black hover:text-white"
                    onClick={() => {
                      const list = getDesignItemsFromLocalStorage();
                      if (
                        list.some(
                          (item) =>
                            (item.collection &&
                              item.collection.id === product.id) ||
                            (!item.collection && item.product.id === product.id)
                        )
                      )
                        return;
                      setDesignItemsToLocalStorage(
                        list.concat(
                          product.type === "COLLECTION"
                            ? product.items.map(
                                (item: ProvidedProductBase, index) => ({
                                  id: (Date.now() + index).toString(),
                                  product: item,
                                  collection: {
                                    ...product,
                                    items: undefined,
                                  },
                                  status: "DESIGNING",
                                  thumbnail: item.thumbnail,
                                })
                              )
                            : [
                                {
                                  id: Date.now().toString(),
                                  product: product,
                                  status: "DESIGNING",
                                  thumbnail: product.thumbnail,
                                },
                              ]
                        )
                      );
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    className="text-black hover:text-white"
                    onClick={() => {
                      const list = getDesignItemsFromLocalStorage();

                      setDesignItemsToLocalStorage(
                        list.filter(
                          (item) =>
                            (item.collection &&
                              item.collection.id !== product.id) ||
                            (!item.collection && item.product.id !== product.id)
                        )
                      );
                    }}
                  >
                    Remove
                  </Button>
                </div>
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
