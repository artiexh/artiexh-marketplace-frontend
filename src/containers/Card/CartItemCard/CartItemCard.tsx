/* eslint-disable @next/next/no-img-element */
import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import LogoCheckbox from "@/components/LogoCheckbox/LogoCheckbox";
import { NOTIFICATION_TYPE } from "@/constants/common";
import {
  deleteCartItem,
  updateCartItem,
} from "@/services/backend/services/cart";
import { CartData, CartItem } from "@/services/backend/types/Cart";
import { CampaignData } from "@/types/Campaign";
import { currencyFormatter } from "@/utils/formatter";
import { getCampaignType, getNotificationIcon } from "@/utils/mapper";
import { Grid, Input, NumberInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { KeyedMutator } from "swr";

type CartItemCardProps = {
  saleCampaign: CampaignData;
  cartItem: CartItem;
  selectEvent?: () => void;
  isChecked?: boolean;
  isCartPage?: boolean;
  deleteEvent?: () => void;
  revalidateFunc?: KeyedMutator<CartData>;
};

export default function CartItemCard({
  saleCampaign,
  cartItem,
  selectEvent,
  isChecked = false,
  isCartPage = true,
  deleteEvent,
  revalidateFunc,
}: CartItemCardProps) {
  const [quantity, setQuantity] = useState<number>(cartItem.quantity ?? 1);
  const [loading, setLoading] = useState(false);

  const campaignType = getCampaignType(saleCampaign);

  const updateCartQuantityMutation = useMutation({
    mutationFn: async (value: number) => {
      if (value === 0) {
        notifications.show({
          message: "Số lượng sản phẩm không thể bằng 0",
          ...getNotificationIcon(NOTIFICATION_TYPE.FAILED),
        });
        return;
      }

      setLoading(true);
      const result = await updateCartItem(
        cartItem.productCode,
        saleCampaign.id,
        value
      );

      if (result == null) throw result;

      return result;
    },
    onSuccess: (data, variables) => {
      if (data) {
        setQuantity(variables);
        notifications.show({
          message: "Cập nhật số lượng thành công",
          ...getNotificationIcon(NOTIFICATION_TYPE.SUCCESS),
        });
      }
    },
    onError: () => {
      notifications.show({
        message: "Cập nhật số lượng thất bại. Vui lòng thử lại sau giây lát",
        ...getNotificationIcon(NOTIFICATION_TYPE.FAILED),
      });
    },
    onSettled: () => {
      revalidateFunc?.();
      setLoading(false);
    },
  });

  const deleteCartItemMutation = useMutation({
    mutationFn: async () => {
      setLoading(true);
      const result = await deleteCartItem([
        {
          productCode: cartItem.productCode,
          saleCampaignId: saleCampaign.id,
        },
      ]);

      if (result == null) throw result;
    },
    onSuccess: () => {
      setQuantity(quantity);
      notifications.show({
        message: "Xóa sản phẩm thành công",
        ...getNotificationIcon(NOTIFICATION_TYPE.SUCCESS),
      });
    },
    onError: () => {
      notifications.show({
        message: "Xóa sản phẩm thất bại. Vui lòng thử lại sau giây lát",
        ...getNotificationIcon(NOTIFICATION_TYPE.FAILED),
      });
    },
    onSettled: () => {
      deleteEvent?.();
      revalidateFunc?.();
      setLoading(false);
    },
  });

  return (
    <div className="cart-item-card">
      <Grid className="hidden sm:flex text-sm md:text-base">
        <Grid.Col span={isCartPage ? 2 : 3} className="my-auto">
          <div className="relative">
            {isCartPage && (
              <LogoCheckbox
                configClass="absolute -top-2 -left-2"
                clickEvent={() => {
                  if (campaignType !== "IN_COMING") {
                    selectEvent?.();
                  }
                }}
                isChecked={isChecked}
              />
            )}
            <ImageWithFallback
              className="object-cover aspect-square w-[80px] md:w-[120px]  rounded-lg"
              src={cartItem.thumbnailUrl}
              alt="product-name"
            />
          </div>
        </Grid.Col>
        <Grid.Col span={3} className="my-auto font-bold">
          {cartItem.name}
        </Grid.Col>
        <Grid.Col span={isCartPage ? 2 : 3} className="my-auto font-bold ">
          {currencyFormatter(cartItem.price.amount)}
        </Grid.Col>
        <Grid.Col span={isCartPage ? 2 : 3} className="my-auto">
          {isCartPage ? (
            cartItem.remainingQuantity > 0 && (
              <NumberInput
                className="w-[60px] md:w-[100px]"
                thousandsSeparator=","
                value={quantity}
                onChange={(value) => {
                  if (
                    typeof value === "number" &&
                    !updateCartQuantityMutation.isLoading
                  ) {
                    updateCartQuantityMutation.mutate(value);
                  }
                }}
                defaultValue={1}
                min={1}
                max={cartItem.remainingQuantity}
              />
            )
          ) : (
            <div>{quantity}</div>
          )}
        </Grid.Col>
        {isCartPage ? (
          <>
            <Grid.Col span={2} className="my-auto font-bold">
              {currencyFormatter(cartItem.price.amount * quantity)}
            </Grid.Col>
            <Grid.Col span={1} className="my-auto text-center">
              <div className="flex justify-center">
                <IconTrash
                  className="cursor-pointer"
                  size="1.125rem"
                  onClick={() => {
                    !deleteCartItemMutation.isLoading &&
                      deleteCartItemMutation.mutate();
                  }}
                />
              </div>
            </Grid.Col>
          </>
        ) : null}
      </Grid>
      <div className="flex justify-between items-center sm:hidden gap-4 text-sm ">
        <div className="relative">
          <LogoCheckbox
            configClass="absolute -top-2 -left-2"
            clickEvent={() => {
              if (campaignType !== "IN_COMING") {
                selectEvent?.();
              }
            }}
            isChecked={isChecked}
          />
          <img
            className="object-fit max-w-[80px] h-[80px] rounded-lg"
            src={cartItem.thumbnailUrl}
            alt="product-name"
          />
        </div>
        <div>
          <div>
            <div className="mb-3 font-bold">{cartItem.name}</div>
            <div className="mb-2">
              Đơn giá: {cartItem.price.amount + " " + cartItem.price.unit}
            </div>
            <div className="flex gap-2 items-center">
              <div>Số lượng:</div>
              {cartItem.remainingQuantity > 0 && (
                <Input
                  className="w-[60px] md:w-[100px]"
                  value={quantity}
                  onChange={(value) => {
                    if (
                      typeof value === "number" &&
                      updateCartQuantityMutation.isLoading === false
                    ) {
                      updateCartQuantityMutation.mutate(value);
                    }
                  }}
                  min={1}
                  max={cartItem.remainingQuantity}
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex">
          <IconTrash
            className="cursor-pointer"
            size="1.125rem"
            onClick={() => {
              !deleteCartItemMutation.isLoading &&
                deleteCartItemMutation.mutate();
            }}
          />
        </div>
      </div>
    </div>
  );
}
