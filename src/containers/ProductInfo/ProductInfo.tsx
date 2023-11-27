import { NOTIFICATION_TYPE } from "@/constants/common";
import { increaseCartItem } from "@/services/backend/services/cart";
import { $user } from "@/store/user";
import { Product } from "@/types/Product";
import { currencyFormatter } from "@/utils/formatter";
import { getCampaignType, getNotificationIcon } from "@/utils/mapper";
import { Button, NumberInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { useRouter } from "next/router";
import { FC, useState } from "react";

type ProductInfoProps = {
  product: Product;
  special?: string;
};

const ProductInfo: FC<ProductInfoProps> = ({ product, special }) => {
  const {
    productCode,
    averageRate,
    name,
    price,
    category,
    saleCampaign: campaign,
  } = product;
  const [quantity, setQuantity] = useState<number>(1);
  const router = useRouter();

  const campaignType = getCampaignType(campaign);

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!$user.get()) {
        //redirect to login
        router.push(
          `/auth/signin?redirect_uri=${encodeURIComponent(router.asPath)}`
        );
        return;
      }
      const result = await increaseCartItem(productCode, campaign.id);

      return result;
    },
    onSuccess: (data) => {
      if (data) {
        notifications.show({
          message: "Thêm vào giỏ hàng thành công",
          ...getNotificationIcon(NOTIFICATION_TYPE.SUCCESS),
        });
        setQuantity(quantity);
      }
    },
    onError: () => {
      notifications.show({
        message: "Thêm vào giỏ hàng thất bại. Vui lòng thử lại sau giây lát",
        ...getNotificationIcon(NOTIFICATION_TYPE.FAILED),
      });
    },
  });

  return (
    <div className="rounded-lg p-5 md:p-8 bg-white flex flex-col col-span-12 md:col-span-5">
      <h1 className="text-3xl">{name}</h1>
      {/* <div className="tag-wrapper flex gap-3 mt-1">
        {tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div> */}
      <div className="mt-2">Type: {category.name}</div>
      <h2 className="text-4xl mt-5">{currencyFormatter(price.amount)}</h2>
      {special && <h4 className="text-red-500 mt-2">{special}</h4>}
      <div className="md:mt-auto">
        {campaignType === "IN_COMING" && (
          <div className="text-red-500 mb-4">
            Bạn chỉ có thể mua sản phẩm này sau ngày{" "}
            {new Date(campaign.from).toLocaleDateString()}
          </div>
        )}
        <div className="flex gap-2 items-center">
          <span className="text-lg font-semibold">So luong</span>
          {product.quantity > 0 && (
            <NumberInput
              classNames={{
                input: "w-20",
              }}
              value={quantity}
              onChange={setQuantity as any}
              defaultValue={1}
              min={1}
              max={product.quantity}
            />
          )}
          <span className="text-subtext">San pham</span>
        </div>
      </div>
      <div className="flex gap-5 mt-5">
        <Button
          loading={addToCartMutation.isLoading}
          disabled={product.quantity == 0 || campaignType === "CLOSED"}
          className={clsx(
            "flex-1",
            campaignType === "CLOSED" ? "!text-white" : "!text-primary"
          )}
          variant="outline"
          onClick={() => addToCartMutation.mutate()}
        >
          Add to cart
        </Button>
      </div>
    </div>
  );
};

export default ProductInfo;
