import axiosClient from "@/services/backend/axiosClient";
import { CartData } from "@/services/backend/types/Cart";
import { Button } from "@mantine/core";
import { NextPage } from "next";
import useSWR from "swr";
import CartSection from "@/components/CartSection/CartSection";
import { useRouter } from "next/router";
import { ROUTE } from "@/constants/route";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";

const CartPage: NextPage = () => {
  const router = useRouter();
  const selectedItems = useSelector(
    (state: RootState) => state.cart.selectedItems
  );

  const dispatch = useDispatch();

  const { data, mutate } = useSWR<CartData>("cart", async () => {
    try {
      const { data } = (await axiosClient("/cart"))?.data;
      return data;
    } catch (e) {
      return null;
    }
  });

  const isChecked = (id: string) => {
    return selectedItems
      .map((item) => item.items)
      .flat()
      .some((cartItem) => cartItem.id == id);
  };

  // if (isLoading) return <></>;

  const totalPrice = selectedItems?.reduce(
    (total, item) =>
      total +
      item.items.reduce(
        (acc, cartItem) => acc + cartItem.price.amount * cartItem.quantity,
        0
      ),
    0
  );

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
        {data?.shopItems?.map((cartSection, idx) => (
          <div
            key={idx}
            className="bg-white mt-10 p-2 sm:p-6 rounded-sm relative"
          >
            <CartSection
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

export default CartPage;
