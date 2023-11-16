import {
  ARTIST_CAMPAIGN_ENDPOINT,
  updateCampaignCustomProductsApi,
} from "@/services/backend/services/campaign";
import { CampaignDetail, CustomProduct } from "@/types/Campaign";
import { CommonResponseBase } from "@/types/ResponseBase";
import { modals } from "@mantine/modals";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import PickCustomProduct from "./PickCustomProduct";
import { Button, NumberInput, Popover, Text } from "@mantine/core";
import TableComponent from "@/components/TableComponent";
import productInCampaignColumns from "@/constants/Columns/productInCampaignColumns";
import CustomProductDetailCard from "../CustomProductDetailCard";
import { useForm } from "@mantine/form";
import { IconHelpCircle } from "@tabler/icons-react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { defaultButtonStylingClass } from "@/constants/common";

export default function CustomProductTable({
  data: rawData,
  disabled = false,
  setDisabled,
}: {
  data: CampaignDetail["products"];
  disabled?: boolean;
  setDisabled: Dispatch<SetStateAction<boolean>>;
}) {
  const routerParams = useParams();
  const queryClient = useQueryClient();

  const id = routerParams!.id as string;
  const campaignRes = queryClient.getQueryData<
    CommonResponseBase<CampaignDetail>
  >([ARTIST_CAMPAIGN_ENDPOINT, { id: id }]);
  const openCustomProductModal = () => {
    modals.open({
      modalId: "custom-product-create-campaign",
      title: "Pick custom products",
      centered: true,
      classNames: {
        // content: "!max-h-none",
      },
      fullScreen: true,
      children: <PickCustomProduct defaultValues={rawData} />,
    });
  };

  useEffect(() => {
    if (
      campaignRes &&
      campaignRes.data.products.length > 0 &&
      campaignRes.data.products.every((item) => item.price && item.quantity)
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [campaignRes]);

  return (
    <>
      <div className="table-header flex w-full justify-between">
        <div className="flex justify-end gap-x-2 items-center">
          <Text>
            Provider:{" "}
            {campaignRes?.data?.provider?.businessName ?? "Không khả dụng"}
          </Text>
          {/* <Button onClick={openProviderModal} disabled={rawData.length <= 0}>
              Pick provider
            </Button> */}
        </div>
        <div>
          <Button
            className={defaultButtonStylingClass}
            onClick={openCustomProductModal}
          >
            Add item
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 w-full mt-3">
        <TableComponent
          columns={productInCampaignColumns}
          data={rawData
            .sort((a, b) => Number(a.id) - Number(b.id))
            .map((data) => {
              return {
                ...data,
                onEdit: () =>
                  modals.open({
                    modalId: `${data.id}-custom-product-edit`,
                    title: "Edit",
                    centered: true,
                    classNames: {
                      content: "!w-[30rem] !h-fit left-[38%] top-1/3",
                    },

                    children: <EditCustomProductModal data={data} />,
                  }),
                onView: () =>
                  modals.open({
                    modalId: `${data.id}-custom-product-view`,
                    title: "Product detail",
                    fullScreen: true,
                    children: (
                      <div className="">
                        <CustomProductDetailCard data={data} campaignId={id} />
                      </div>
                    ),
                  }),
              };
            })}
        />
      </div>
    </>
  );
}

function EditCustomProductModal({ data: product }: { data: CustomProduct }) {
  const routerParams = useParams();
  const queryClient = useQueryClient();

  const id = routerParams!.id as string;
  const form = useForm<{
    quantity: number;
    price: number;
  }>({
    initialValues: {
      quantity: product.quantity,
      price: product.price.amount,
    },
    validate: {
      price: (value, values, path) => {
        const index = Number(path.split(".")[1]);
        const config = product;
        if (config && config?.providerConfig?.basePriceAmount >= value) {
          return `Price of this product should be greater than ${config.providerConfig?.basePriceAmount}`;
        }
        return null;
      },
      quantity: (value, values, path) => {
        const index = Number(path.split(".")[1]);
        const config = product;
        if (config && config.providerConfig?.minQuantity > value) {
          return `Quantiy of this product should be equal or greater than ${config.providerConfig?.minQuantity}`;
        }
        return null;
      },
    },
    validateInputOnBlur: true,
    validateInputOnChange: true,
  });

  const updateHandler = async (data: { quantity: number; price: number }) => {
    const campaignRes = queryClient.getQueryData<
      CommonResponseBase<CampaignDetail>
    >([ARTIST_CAMPAIGN_ENDPOINT, { id: id }]);
    if (!campaignRes?.data) throw new Error("What the heck");
    const tmp = campaignRes.data.products.filter(
      (d) => d.customProduct.id !== product.customProduct.id
    );
    const res = await updateCampaignCustomProductsApi(
      campaignRes.data,
      [
        ...tmp.map((v) => {
          return {
            customProductId: v.customProduct.id,
            quantity: v.quantity,
            price: v.price,
          } as Pick<CustomProduct, "price" | "quantity"> & {
            customProductId: string;
          };
        }),
        {
          customProductId: product.customProduct.id,
          quantity: data.quantity,
          price: {
            amount: data.price,
            unit: "VND",
          },
        },
      ],
      campaignRes.data.provider.businessCode
    );
    queryClient.setQueryData([ARTIST_CAMPAIGN_ENDPOINT, { id: id }], res.data);
    modals.close(`${product.id}-custom-product-edit`);
  };

  return (
    <form onSubmit={form.onSubmit(updateHandler)}>
      <NumberInput
        classNames={{
          label: "w-full flex items-center",
        }}
        label={
          <div className="flex justify-between items-center w-full">
            <span className="flex items-center gap-x-1">
              <span>
                {`Price (Min: ${product.providerConfig?.basePriceAmount})`}{" "}
              </span>
              <Popover position="top" withArrow shadow="md">
                <Popover.Target>
                  <IconHelpCircle size={16} className="text-primary" />
                </Popover.Target>
                <Popover.Dropdown style={{ pointerEvents: "none" }}>
                  <span>Your profit = product price - min sale price</span>
                </Popover.Dropdown>
              </Popover>
            </span>
            <span className="text-gray-500">{`Your profit: ${
              Number(form.values.price ?? 0) -
              product?.providerConfig?.basePriceAmount
            }`}</span>
          </div>
        }
        className="flex-[3]"
        hideControls
        min={1}
        {...form.getInputProps(`price`)}
      />
      <NumberInput
        classNames={{
          label: "w-fit flex items-center",
        }}
        label={
          <div className="flex">
            <span className="flex gap-x-1 items-center">
              <span>
                {`Quantity (Min: ${product.providerConfig?.minQuantity})`}{" "}
              </span>
              <Popover position="top" withArrow shadow="md">
                <Popover.Target>
                  <IconHelpCircle size={16} className="text-primary" />
                </Popover.Target>
                <Popover.Dropdown style={{ pointerEvents: "none" }}>
                  <span>
                    The manufacturing provider only accept the quantity that is
                    greater than the minimum quantity
                  </span>
                </Popover.Dropdown>
              </Popover>
            </span>
          </div>
        }
        className="col-span-12 md:col-span-4"
        min={1}
        {...form.getInputProps(`quantity`)}
      />
      <div className="w-full flex justify-end mt-4">
        <Button type="submit">Update</Button>
      </div>
    </form>
  );
}
