/* eslint-disable @next/next/no-img-element */
import LogoCheckbox from "@/components/LogoCheckbox/LogoCheckbox";
import {
  deleteCartItem,
  updateCartItem,
} from "@/services/backend/services/cart";
import { CartData, CartItem } from "@/services/backend/types/Cart";
import { CampaignData } from "@/types/Campaign";
import { currencyFormatter } from "@/utils/formatter";
import { getCampaignType } from "@/utils/mapper";
import { Grid, NumberInput } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
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

  const updateCartQuantity = async (value: number) => {
    if (!loading) {
      setLoading(true);
      const result = await updateCartItem(
        cartItem.productCode,
        saleCampaign.id,
        value
      );

      if (result != null) {
        setQuantity(value);
        revalidateFunc?.();
        setLoading(false);
      }
    }
  };

  const deleteItemFromCart = async () => {
    if (!loading) {
      setLoading(true);
      const result = await deleteCartItem([
        {
          productCode: cartItem.productCode,
          saleCampaignId: saleCampaign.id,
        },
      ]);
      if (result != null) {
        deleteEvent?.();
        revalidateFunc?.();
        setQuantity(quantity);
        setLoading(false);
      }
    }
  };

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
            <img
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
                value={quantity}
                onChange={(value) => {
                  if (typeof value === "number") {
                    updateCartQuantity(value);
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
                  onClick={deleteItemFromCart}
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
                <NumberInput
                  className="w-[60px] md:w-[100px]"
                  value={quantity}
                  onChange={(value) => {
                    if (typeof value === "number") {
                      updateCartQuantity(value);
                    }
                  }}
                  defaultValue={1}
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
            onClick={deleteItemFromCart}
          />
        </div>
      </div>
    </div>
  );
}
