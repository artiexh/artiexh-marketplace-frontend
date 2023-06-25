import Layout from "@/layouts/Layout/Layout";
import axiosClient from "@/services/backend/haiEndpointCC";
import { CartData, CartItem } from "@/services/backend/types/Cart";
import { Button } from "@mantine/core";
import { NextPage } from "next";
import useSWR from "swr";
import { useState } from "react";
import CartSection from "@/components/CartSection/CartSection";

type SelectedItems = {
  artistId: number;
  items: CartItem[];
};

const CartPage: NextPage = () => {
  const { data, isLoading } = useSWR<CartData>("cart", async () => {
    try {
      const { data } = (await axiosClient("/cart")).data;
      return data;
    } catch (e) {
      console.log(e);
      return null;
    }
  });
  const [selectedItems, setSelectedItems] = useState<SelectedItems[]>([]);

  const toggleSelectItems = (
    artistId: number,
    items: CartItem[],
    isAll = false
  ) => {
    const selectItem = selectedItems.find((item) => item.artistId == artistId);
    let newArr = [...selectedItems];
    if (isAll) {
      newArr = selectedItems.filter((item) => item.artistId != artistId);

      if (!selectItem) {
        newArr.push({
          artistId,
          items,
        });
      }
    } else {
      console.log(selectItem);
      if (selectItem) {
        const nestedItem = selectItem.items.find(
          (item) => (item.id = items[0].id)
        );
        newArr.forEach((item) => {
          if (item.artistId == artistId) {
            if (nestedItem) {
              item.items = item.items.filter((item) => item.id != items[0].id);
            } else {
              item.items.push(items[0]);
            }
          }
        });
      } else {
        newArr.push({
          artistId,
          items,
        });
      }
    }
    setSelectedItems(newArr);
  };

  const isChecked = (id: number) => {
    return selectedItems
      .map((item) => item.items)
      .flat()
      .some((cartItem) => cartItem.id == id);
  };

  if (isLoading) return <></>;

  const totalPrice = selectedItems?.reduce(
    (total, item) =>
      total + item.items.reduce((acc, cartItem) => acc + cartItem.price, 0),
    0
  );

  return (
    <Layout>
      <div className="hidden card sm:flex justify-between items-center">
        <div className="font-bold text-[2rem] ">Tổng: {totalPrice} VND</div>
        <div>
          <Button className="bg-[#50207D] w-[200px] h-[3rem]">Checkout</Button>
        </div>
      </div>
      <div>
        {data?.artistItems.map((cartSection, idx) => (
          <div
            key={idx}
            className="bg-white mt-10 p-2 sm:p-6 rounded-sm relative"
          >
            <CartSection
              cartSection={cartSection}
              toggleSelectItems={toggleSelectItems}
              isChecked={isChecked}
            />
          </div>
        ))}
      </div>
      <div className="flex card sm:hidden justify-between items-center absolute bottom-0 w-[100vw] left-0">
        <div className="font-bold ">Tổng: {totalPrice} VND</div>
        <div>
          <Button className="bg-[#50207D] w-[120px] h-[3rem]">Checkout</Button>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
