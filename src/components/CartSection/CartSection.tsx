/* eslint-disable @next/next/no-img-element */
import CartItemCard from "@/containers/Card/CartItemCard/CartItemCard";
import { CartData, CartItem, CartSection } from "@/services/backend/types/Cart";
import { deleteItems, toggleSelectItems } from "@/store/slices/cartSlice";
import { getCampaignType } from "@/utils/mapper";
import { Button, Divider, Grid } from "@mantine/core";
import { AnyAction } from "@reduxjs/toolkit";
import { useRouter } from "next/router";
import { Dispatch } from "react";
import { KeyedMutator } from "swr";
import ImageWithFallback from "../ImageWithFallback/ImageWithFallback";
import LogoCheckbox from "../LogoCheckbox/LogoCheckbox";

type CartSectionProps = {
  cartSection: CartSection;
  dispatch: Dispatch<AnyAction>;
  isChecked: (cmpaignId: string, productCode: string) => boolean;
  isCartPage?: boolean;
  revalidateFunc?: KeyedMutator<CartData>;
};

const messageMapper = (campaignType: "IN_COMING" | "CLOSED" | "IN_GOING") => {
  switch (campaignType) {
    case "IN_COMING":
      return "Chiến dịch chưa bắt đầu, vui lòng chờ tới ngày mở bán để tiến hành thanh toán";
    case "CLOSED":
      return "Chiến dịch đã kết thúc, vui lòng xóa sản phẩm khỏi giỏ hàng";
    default:
      return;
  }
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

  const campaignType = getCampaignType(cartSection.saleCampaign);

  const deleteItemFromCart = (productId: string) => {
    dispatch(deleteItems({ productId }));
  };

  const checkCartSection = () => {
    if (!["IN_COMING", "CLOSED"].includes(campaignType)) {
      dispatch(
        toggleSelectItems({
          cartSection: {
            saleCampaign: cartSection.saleCampaign,
            items: cartSection.items,
          },
          isAll: true,
        })
      );
    }
  };

  return (
    <div className="cart-section ">
      {isCartPage && (
        <LogoCheckbox
          configClass="absolute -top-2 -left-2"
          clickEvent={checkCartSection}
          isChecked={cartSection.items.every((item) =>
            isChecked(cartSection.saleCampaign.id, item.productCode)
          )}
        />
      )}
      {messageMapper(campaignType) && (
        <div className="text-red-500 mb-4 ">{messageMapper(campaignType)}</div>
      )}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div>
            <ImageWithFallback
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
        <div className="gap-x-2 flex items-center">
          <Button
            className="text-primary font-bold hover:bg-white"
            onClick={() => {
              router.push(`/campaigns/${cartSection.saleCampaign.id}`);
            }}
          >
            Xem chi tiết
          </Button>
        </div>
      </div>
      <Divider className="mt-5 mb-4 relative -left-2 sm:-left-6 !w-[calc(100%+16px)] sm:!w-[calc(100%+48px)]" />
      <div className="hidden sm:block">
        <Grid className="text-[#AFAFAF] font-bold text-sm md:text-base">
          <Grid.Col span={isCartPage ? 2 : 3} className="my-auto">
            Sản phẩm
          </Grid.Col>
          <Grid.Col span={3} className="my-auto"></Grid.Col>
          <Grid.Col span={isCartPage ? 2 : 3} className="my-auto">
            Giá
          </Grid.Col>
          <Grid.Col span={isCartPage ? 2 : 3} className="my-auto">
            Số lượng
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
              disabled={campaignType === "CLOSED"}
              saleCampaign={cartSection.saleCampaign}
              cartItem={item}
              selectEvent={() => toggleCartItemHandler(item)}
              deleteEvent={() => deleteItemFromCart(item.productCode)}
              isChecked={isChecked(
                cartSection.saleCampaign.id,
                item.productCode
              )}
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
