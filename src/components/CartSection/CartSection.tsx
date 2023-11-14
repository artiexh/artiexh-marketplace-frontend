import CartItemCard from "@/containers/Card/CartItemCard/CartItemCard";
import { Button, Divider, Grid } from "@mantine/core";
import LogoCheckbox from "../LogoCheckbox/LogoCheckbox";
import Image from "next/image";
import { CartData, CartItem, CartSection } from "@/services/backend/types/Cart";
import { AnyAction } from "@reduxjs/toolkit";
import { Dispatch } from "react";
import { deleteItems, toggleSelectItems } from "@/store/slices/cartSlice";
import { KeyedMutator } from "swr";
import { useRouter } from "next/router";
import ImageWithFallback from "../ImageWithFallback/ImageWithFallback";

type CartSectionProps = {
  cartSection: CartSection;
  dispatch: Dispatch<AnyAction>;
  isChecked: (id: string) => boolean;
  isCartPage?: boolean;
  revalidateFunc?: KeyedMutator<CartData>;
};

export default function CartSection({
  cartSection,
  isChecked,
  dispatch,
  isCartPage = true,
  revalidateFunc,
}: CartSectionProps) {
  const router = useRouter();
  const toggleCartItemHandler = (item: CartItem) => {
    dispatch(
      toggleSelectItems({
        cartSection: {
          saleCampaign: cartSection.saleCampaign,
          items: [item],
        },
        isAll: false,
      })
    );
  };

  const deleteItemFromCart = (productId: string) => {
    dispatch(deleteItems({ productId }));
  };
  return (
    <div className="cart-section">
      {isCartPage && (
        <LogoCheckbox
          configClass="absolute -top-2 -left-2"
          clickEvent={() =>
            dispatch(
              toggleSelectItems({
                cartSection: {
                  saleCampaign: cartSection.saleCampaign,
                  items: cartSection.items,
                },
                isAll: true,
              })
            )
          }
          isChecked={cartSection.items.every((item) =>
            isChecked(item.productCode)
          )}
        />
      )}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div>
            <ImageWithFallback
              fallback="/assets/default-thumbnail.jpg"
              className="object-fit rounded-full w-[40px] sm:w-[70px] aspect-square mr-3"
              src={cartSection.saleCampaign.thumbnailUrl}
              alt="product-name"
              width={70}
              height={70}
            />
          </div>
          <div className="text-sm sm:text-base">
            <div>{cartSection.saleCampaign.name}</div>
          </div>
        </div>
        <div>
          <Button
            className="text-primary font-bold"
            onClick={() => {
              router.push(`/campaigns/${cartSection.saleCampaign.id}`);
            }}
          >
            View campaign
          </Button>
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
              <Grid.Col span={1} className="my-auto text-center">
                Actions
              </Grid.Col>
            </>
          ) : null}
        </Grid>
        <Divider className="mt-2 mb-5 relative -left-2 sm:-left-6 !w-[calc(100%+16px)] sm:!w-[calc(100%+48px)]" />
      </div>
      <div className="cart-section">
        {cartSection.items.map((item, index, arr) => (
          <div key={item.productCode}>
            <CartItemCard
              saleCampaignId={cartSection.saleCampaign.id}
              cartItem={item}
              selectEvent={() => toggleCartItemHandler(item)}
              deleteEvent={() => deleteItemFromCart(item.productCode)}
              isChecked={isChecked(item.productCode)}
              isCartPage={isCartPage}
              revalidateFunc={revalidateFunc}
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
