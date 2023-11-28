import TableComponent from "@/components/TableComponent";
import productInCampaignColumns from "@/constants/Columns/productInCampaignColumns";
import { defaultButtonStylingClass } from "@/constants/common";
import axiosClient from "@/services/backend/axiosClient";
import {
  ARTIST_CAMPAIGN_ENDPOINT,
  updateCampaignCustomProductsApi,
} from "@/services/backend/services/campaign";
import { CampaignDetail, CustomProduct } from "@/types/Campaign";
import { CommonResponseBase } from "@/types/ResponseBase";
import { configCalculate } from "@/utils/campaign.utils";
import { currencyFormatter } from "@/utils/formatter";
import { Button, NumberInput, Text, Tooltip } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { IconHelpCircle } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import useSWR from "swr";
import CustomProductDetailCard from "../CustomProductDetailCard";
import PickCustomProduct from "./PickCustomProduct";

export default function CustomProductTable({
  data: rawData,
  disabled = false,
}: {
  data: CampaignDetail["products"];
  disabled?: boolean;
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

      size: "80rem",
      children: <PickCustomProduct defaultValues={rawData} />,
    });
  };

  return (
    <div className="py-5 px-7 bg-white shadow rounded-lg">
      <div className="table-header flex w-full justify-between ">
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
            disabled={disabled}
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
                onEdit: !disabled
                  ? () =>
                      modals.open({
                        modalId: `${data.id}-custom-product-edit`,
                        title: "Tùy chỉnh giá bán và số lượng",
                        centered: true,
                        classNames: {
                          content: "!w-[60rem] !h-fit left-[38%] top-1/3",
                          title: "font-semibold",
                        },
                        children: <EditCustomProductModal data={data} />,
                      })
                  : undefined,
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
    </div>
  );
}

function EditCustomProductModal({ data: product }: { data: CustomProduct }) {
  const routerParams = useParams();
  const queryClient = useQueryClient();
  const { data: res } = useSWR("config", async () =>
    axiosClient("/campaign/artiexh-percentage")
  );

  const percentage = res?.data.data.percentage;

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
      <div className="text-gray-600 mb-6 text-sm">
        Arty sẽ thu {percentage}% trên mỗi đơn hàng của bạn
      </div>
      <NumberInput
        thousandsSeparator=","
        classNames={{
          label: "w-full flex items-center",
          root: "mb-4",
        }}
        label={
          <div className="flex justify-between items-center w-full">
            <span className="flex items-center gap-x-1">
              <span>Price</span>
              <Tooltip
                label={`Lợi nhuận sẽ bằng giá bạn đưa ra trừ cho giá sản xuất (
                    ${currencyFormatter(
                      product.providerConfig?.basePriceAmount
                    )}
                    )`}
              >
                <IconHelpCircle size={16} className="text-primary" />
              </Tooltip>
            </span>
            {form.values.price &&
              form.values.price > product?.providerConfig?.basePriceAmount && (
                <span className="text-gray-500">{`Lợi nhuận của bạn: ${currencyFormatter(
                  configCalculate(
                    Number(form.values.price ?? 0),
                    product?.providerConfig?.basePriceAmount ?? 0,
                    percentage
                  ).artistProfit
                )}`}</span>
              )}
          </div>
        }
        className="flex-[3]"
        hideControls
        min={1}
        {...form.getInputProps(`price`)}
      />
      <NumberInput
        thousandsSeparator=","
        classNames={{
          label: "w-fit flex items-center",
        }}
        label={
          <div className="flex">
            <span className="flex gap-x-1 items-center">
              <span>Quantity</span>
              <Tooltip
                label={`Sản phẩm này chỉ nhận khi đơn sản xuất lớn hơn 
                    ${product.providerConfig?.minQuantity} cái`}
              >
                <IconHelpCircle size={16} className="text-primary" />
              </Tooltip>
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
