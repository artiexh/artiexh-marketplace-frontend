import axiosClient from "@/services/backend/axiosClient";
import { CartData, CartItem, CartSection } from "@/services/backend/types/Cart";
import { Button } from "@mantine/core";
import { NextPage } from "next";
import useSWR from "swr";
import CartSectionComponent from "@/components/CartSection/CartSection";
import { useRouter } from "next/router";
import { ROUTE } from "@/constants/route";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";
import { IconSearchOff } from "@tabler/icons-react";
import AuthWrapper from "@/services/guards/AuthWrapper";
import { SelectedItems } from "@/types/Cart";
import { CommonResponseBase } from "@/types/ResponseBase";

const CartPage = () => {
  const router = useRouter();

  // the selectedData saved in store
  const selectedItems = useSelector(
    (state: RootState) => state.cart.selectedItems
  );

  const dispatch = useDispatch();

  const { data, mutate } = useSWR("cart", async () => {
    try {
      const result = await axiosClient.get<
        CommonResponseBase<{ campaigns: SelectedItems[] }>
      >("/cart");
      return result.data.data.campaigns ?? [];
    } catch (e) {
      return null;
    }
  });

  console.log(data);

  const flattedItems = selectedItems.map((item) => item.items).flat();

  const isChecked = (id: string) => {
    return flattedItems.some((cartItem) => cartItem.id == id);
  };

  // the actual calculated selected data from api
  const selectedCartItems = useMemo(() => {
    const items: CartSection[] = [];
    flattedItems.forEach((item) => {
      data?.forEach((shopItem) => {
        const selectedProducts: CartItem[] = [];
        shopItem.items.forEach((i) => {
          if (item.id === i.id) {
            selectedProducts.push(i);
          }
        });

        if (selectedProducts.length > 0) {
          items.push({
            campaign: shopItem.campaign,
            items: selectedProducts,
          });
        }
      });
    });

    return items;
  }, [data, selectedItems]);

  const totalPrice = selectedCartItems?.reduce(
    (total, item) =>
      total +
      item.items.reduce(
        (acc, cartItem) => acc + cartItem.price.amount * cartItem.quantity,
        0
      ),
    0
  );

  console.log(data);

  if (data?.length === 0) {
    return (
      <div className="text-center mt-[20%]">
        <div className="flex justify-center">
          <IconSearchOff width={150} height={150} />
        </div>
        <div className="text-xl mt-4">
          Bạn vẫn chưa chọn sản phẩm trong giỏ hàng!
        </div>
        <div
          className="mt-2 cursor-pointer text-primary"
          onClick={() => router.push(ROUTE.HOME_PAGE)}
        >
          Ấn vào đây tiếp tục mua sắm
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="hidden card sm:flex justify-between items-center">
        <div className="font-bold text-[2rem] ">Tổng: {totalPrice} VND</div>
        <div>
          <Button
            disabled={selectedItems.length === 0}
            onClick={() => router.push(ROUTE.CHECKOUT)}
            className="bg-[#50207D] w-[200px] h-[3rem]"
          >
            Checkout
          </Button>
        </div>
      </div>
      <div>
        {data?.map((cartSection, idx) => (
          <div
            key={idx}
            className="bg-white mt-10 p-2 sm:p-6 rounded-sm relative"
          >
            <CartSectionComponent
              cartSection={cartSection}
              dispatch={dispatch}
              isChecked={isChecked}
              revalidateFunc={mutate}
            />
          </div>
        ))}
      </div>
      <div className="flex card sm:hidden justify-between items-center absolute bottom-0 w-[100vw] left-0">
        <div className="font-bold ">Tổng: {totalPrice} VND</div>
        <div>
          <Button
            disabled={selectedItems.length === 0}
            className="bg-[#50207D] w-[120px] h-[3rem]"
            onClick={() => router.push(ROUTE.CHECKOUT)}
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

CartPage.getLayout = function getLayout(page: any) {
  return <Wrapper>{page}</Wrapper>;
};

function Wrapper({ children }: { children: any }) {
  const router = useRouter();
  return <AuthWrapper router={router}>{children}</AuthWrapper>;
}

export default CartPage;
