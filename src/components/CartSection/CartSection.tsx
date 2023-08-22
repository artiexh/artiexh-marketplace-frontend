import CartItemCard from "@/containers/Card/CartItemCard/CartItemCard";
import { Button, Divider, Grid } from "@mantine/core";
import LogoCheckbox from "../LogoCheckbox/LogoCheckbox";
import Image from "next/image";
import { CartSection } from "@/services/backend/types/Cart";
import { AnyAction } from "@reduxjs/toolkit";
import { Dispatch } from "react";
import { toggleSelectItems } from "@/store/slices/cartSlice";

type CartSectionProps = {
  cartSection: CartSection;
  dispatch: Dispatch<AnyAction>;
  isChecked: (id: string) => boolean;
  isCartPage?: boolean;
};

export default function CartSection({
  cartSection,
  isChecked,
  dispatch,
  isCartPage = true,
}: CartSectionProps) {
  return (
    <div className="cart-section">
      <LogoCheckbox
        configClass="absolute -top-2 -left-2"
        clickEvent={() =>
          dispatch(
            toggleSelectItems({
              cartSection: {
                artist: cartSection.artist,
                items: cartSection.items,
              },
              isAll: true,
            })
          )
        }
        isChecked={cartSection.items.every((item) => isChecked(item.id))}
      />
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div>
            <Image
              className="object-fit rounded-full w-[40px] sm:w-[70px] aspect-square mr-3"
              src="https://i0.wp.com/thatnhucuocsong.com.vn/wp-content/uploads/2022/01/anh-wibu.jpg?ssl=1"
              alt="product-name"
              width={70}
              height={70}
            />
          </div>
          <div className="text-sm sm:text-base">
            <div>{cartSection.artist.displayName}</div>
            <div>{cartSection.artist.username}</div>
          </div>
        </div>
        <div>
          <Button className="text-primary font-bold">View shop</Button>
        </div>
      </div>
      <Divider className="mt-5 mb-4 relative -left-2 sm:-left-6 !w-[calc(100%+16px)] sm:!w-[calc(100%+48px)]" />
      <div className="hidden sm:block">
        <Grid className="text-[#AFAFAF] font-bold text-sm md:text-base">
          <Grid.Col span={isCartPage ? 2 : 3} className="my-auto">
            Product
          </Grid.Col>
          <Grid.Col span={3} className="my-auto"></Grid.Col>
          <Grid.Col span={isCartPage ? 2 : 3} className="my-auto">
            Price
          </Grid.Col>
          <Grid.Col span={isCartPage ? 2 : 3} className="my-auto">
            Quantity
          </Grid.Col>
          {isCartPage ? (
            <>
              <Grid.Col span={2} className="my-auto">
                Total
              </Grid.Col>
              <Grid.Col span={1} className="my-auto">
                Actions
              </Grid.Col>
            </>
          ) : null}
        </Grid>
        <Divider className="mt-2 mb-5 relative -left-2 sm:-left-6 !w-[calc(100%+16px)] sm:!w-[calc(100%+48px)]" />
      </div>
      <div className="cart-section">
        {cartSection.items.map((item, index, arr) => (
          <div key={item.id}>
            <CartItemCard
              cartItem={item}
              selectEvent={() =>
                dispatch(
                  toggleSelectItems({
                    cartSection: {
                      artist: cartSection.artist,
                      items: [item],
                    },
                    isAll: false,
                  })
                )
              }
              isChecked={isChecked(item.id)}
              isCartPage={isCartPage}
            />
            {index !== arr.length - 1 && (
              <Divider className="my-4 relative -left-2 sm:-left-6 !w-[calc(100%+16px)] sm:!w-[calc(100%+48px)]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
