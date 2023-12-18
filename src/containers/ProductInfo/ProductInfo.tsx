import {
  NOTIFICATION_TYPE,
  remaniningQuantityThreshold,
} from "@/constants/common";
import { increaseCartItem } from "@/services/backend/services/cart";
import { $user } from "@/store/user";
import { Product } from "@/types/Product";
import { errorHandler } from "@/utils/errorHandler";
import { currencyFormatter, dateFormatter } from "@/utils/formatter";
import { getCampaignType, getNotificationIcon } from "@/utils/mapper";
import { ActionIcon, Badge, Button, NumberInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useStore } from "@nanostores/react";
import { IconCopy, IconLink } from "@tabler/icons-react";

import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import {
  FacebookIcon,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  XIcon,
} from "react-share";

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
    tags,
    saleCampaign: campaign,
  } = product;
  console.log(product);
  const [quantity, setQuantity] = useState<number>(1);
  const router = useRouter();
  const user = useStore($user);

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
    onError: (e) => {
      errorHandler(e);
    },
  });

  return (
    <div className="rounded-lg p-5 md:p-8 bg-white flex flex-col col-span-12 md:col-span-5 shadow">
      <h1 className="text-3xl">{name}</h1>
      <div className="tag-wrapper flex gap-3 mt-2">
        {tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
      <div className="mt-4">Loại: {category.name}</div>

      <h2 className="text-4xl mt-5">{currencyFormatter(price.amount)}</h2>

      <div className="mt-2">
        {campaignType === "IN_COMING" && (
          <div className="text-red-500 mb-4">
            Sản phẩm này chỉ chính thức được bán sau ngày{" "}
            {dateFormatter(campaign.from)}
          </div>
        )}
        {new Date(product.saleCampaign.from) <= new Date() &&
        new Date(product.saleCampaign.to) >= new Date() ? (
          product.quantity <= 0 ? (
            <div className="text-red-500 mb-4">Đã hết hàng</div>
          ) : product.quantity <= remaniningQuantityThreshold ? (
            <div className="text-red-500 mb-4">
              Chỉ còn {product.quantity} sản phẩm
            </div>
          ) : (
            <div>Còn {product.quantity} sản phẩm</div>
          )
        ) : new Date(product.saleCampaign.to) <= new Date() ||
          product.saleCampaign.status === "CLOSED" ? (
          <div className="p-4 text-red-500 mb-4">Chiến dịch đã kết thúc</div>
        ) : null}
      </div>
      <div className="md:mt-auto">
        <div className="flex gap-5 mt-5">
          <Button
            loading={addToCartMutation.isLoading}
            disabled={
              product.quantity == 0 ||
              campaignType === "CLOSED" ||
              product.owner.username === user?.username
            }
            className={clsx(
              "flex-1",
              campaignType === "CLOSED" ? "!text-white" : "!text-primary"
            )}
            variant="outline"
            onClick={() => addToCartMutation.mutate()}
          >
            {product.owner.username !== user?.username
              ? "Thêm vào giỏ"
              : "Đây là sản phẩm của bạn"}
          </Button>
        </div>
      </div>
      <div className="share-wrapper flex gap-x-2 mt-4 justify-end">
        <ActionIcon
          className="!bg-primary w-8 h-8 rounded-full"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            notifications.show({
              message: "Đã copy link",
              ...getNotificationIcon(NOTIFICATION_TYPE.SUCCESS),
            });
          }}
        >
          <IconLink color="white" size={24} />
        </ActionIcon>
        <FacebookShareButton url={window.location.href}>
          <FacebookIcon size={32} round={true} />
        </FacebookShareButton>

        <TwitterShareButton url={window.location.href}>
          <XIcon size={32} round={true} />
        </TwitterShareButton>
      </div>
    </div>
  );
};

export default ProductInfo;
