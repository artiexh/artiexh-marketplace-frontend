import Badge from "@/components/Badge/Badge";
import { NOTIFICATION_TYPE } from "@/constants/common";
import {
  increaseCartItem,
  updateCartItem,
} from "@/services/backend/services/cart";
import { Product } from "@/types/Product";
import { currencyFormatter } from "@/utils/formatter";
import { getCampaignType, getNotificationIcon } from "@/utils/mapper";
import { Rating, NumberInput, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import clsx from "clsx";
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
  const [loading, setLoading] = useState(false);

  const campaignType = getCampaignType(campaign);

  const updateCartQuantity = async () => {
    if (!loading) {
      setLoading(true);
      const result = await increaseCartItem(productCode, campaign.id);

      if (result != null) {
        notifications.show({
          message: "Thêm vào giỏ hàng thành công",
          ...getNotificationIcon(NOTIFICATION_TYPE.SUCCESS),
        });
        setQuantity(quantity);
        setLoading(false);
      } else {
        notifications.show({
          message: "Thêm vào giỏ hàng thất bại. Vui lòng thử lại sau giây lát",
          ...getNotificationIcon(NOTIFICATION_TYPE.FAILED),
        });
      }
    }
  };

  return (
    <div className="rounded-lg p-5 md:p-8 bg-white flex flex-col col-span-12 md:col-span-5">
      <h1 className="text-3xl">{name}</h1>
      {/* <div className="tag-wrapper flex gap-3 mt-1">
        {tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div> */}
      <div className="mt-2">Type: {category.name}</div>
      <div className="flex items-end gap-3 mt-3">
        <span className="font-bold text-2xl text-primary leading-none">
          {averageRate}/5
        </span>
        <Rating value={averageRate} size="lg" color="customPrimary" readOnly />
      </div>
      <h2 className="text-4xl mt-5">{currencyFormatter("vn", price)}</h2>
      {special && <h4 className="text-red-500">{special}</h4>}
      <div className="mt-10 md:mt-auto flex gap-2 items-center">
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
      <div className="flex gap-5 mt-5">
        <Button
          disabled={product.quantity == 0 || campaignType === "CLOSED"}
          className="flex-1 bg-primary !text-white"
        >
          Buy now
        </Button>
        <Button
          disabled={product.quantity == 0 || campaignType === "CLOSED"}
          className={clsx(
            "flex-1",
            campaignType === "CLOSED" ? "!text-white" : "!text-primary"
          )}
          variant="outline"
          onClick={updateCartQuantity}
        >
          Add to cart
        </Button>
      </div>
    </div>
  );
};

export default ProductInfo;
