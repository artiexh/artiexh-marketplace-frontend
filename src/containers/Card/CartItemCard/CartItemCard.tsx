/* eslint-disable @next/next/no-img-element */
import { CartData, CartItem } from "@/services/backend/types/Cart";
import { useState } from "react";
import { Grid, NumberInput } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import {
  deleteCartItem,
  updateCartItem,
} from "@/services/backend/services/cart";
import LogoCheckbox from "@/components/LogoCheckbox/LogoCheckbox";
import { KeyedMutator } from "swr";

type CartItemCardProps = {
  cartItem: CartItem;
  selectEvent?: () => void;
  isChecked?: boolean;
  isCartPage?: boolean;
  deleteEvent?: () => void;
  revalidateFunc?: KeyedMutator<CartData>;
};

export default function CartItemCard({
  cartItem,
  selectEvent,
  isChecked = false,
  isCartPage = true,
  deleteEvent,
  revalidateFunc,
}: CartItemCardProps) {
  const [quantity, setQuantity] = useState<number>(cartItem.quantity ?? 1);
  const [loading, setLoading] = useState(false);

  const updateCartQuantity = async (value: number) => {
    if (!loading) {
      setLoading(true);
      const result = await updateCartItem(cartItem.id.toString(), value);

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
      const result = await deleteCartItem([cartItem.id]);
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
                clickEvent={selectEvent}
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
          {cartItem.price.amount + cartItem.price.unit}
        </Grid.Col>
        <Grid.Col span={isCartPage ? 2 : 3} className="my-auto">
          {isCartPage ? (
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
            />
          ) : (
            <div>{quantity}</div>
          )}
        </Grid.Col>
        {isCartPage ? (
          <>
            <Grid.Col span={2} className="my-auto font-bold">
              {cartItem.price.amount * quantity}
            </Grid.Col>
            <Grid.Col span={1} className="my-auto text-center">
              <div className="flex justify-center">
                <IconTrash size="1.125rem" onClick={deleteItemFromCart} />
              </div>
            </Grid.Col>
          </>
        ) : null}
      </Grid>
      <div className="flex justify-between items-center sm:hidden gap-4 text-sm ">
        <div className="relative">
          <LogoCheckbox
            configClass="absolute -top-2 -left-2"
            clickEvent={selectEvent}
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
              <NumberInput
                className="w-[60px] md:w-[100px]"
                value={quantity}
                onChange={(value) => {
                  console.log(value);
                  if (typeof value === "number") {
                    updateCartQuantity(value);
                  }
                }}
                defaultValue={1}
                min={1}
              />
            </div>
          </div>
        </div>
        <div className="flex">
          <IconTrash size="1.125rem" onClick={deleteItemFromCart} />
        </div>
      </div>
    </div>
  );
}
