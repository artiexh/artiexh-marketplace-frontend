import axiosClient from "@/services/backend/axiosClient";
import { CartData, CartItem } from "@/services/backend/types/Cart";
import { Button } from "@mantine/core";
import { NextPage } from "next";
import useSWR from "swr";
import { useState } from "react";
import CartSection from "@/components/CartSection/CartSection";
import { useRouter } from "next/router";
import { ROUTE } from "@/constants/route";
import { SelectedItems } from "@/types/Cart";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";

const CartPage: NextPage = () => {
  const router = useRouter();
  const selectedItems = useSelector(
    (state: RootState) => state.cart.selectedItems
  );
  const dispatch = useDispatch();

  // const { data, isLoading } = useSWR<CartData>("cart", async () => {
  //   try {
  //     const { data } = (await axiosClient("/cart"))?.data;
  //     return data;
  //   } catch (e) {
  //     return null;
  //   }
  // });

  const data = {
    artistItems: [
      {
        artist: {
          id: "455926885855466415",
          username: "artist05",
          displayName: "Artist 05",
        },
        items: [
          {
            id: "456151164010718736",
            status: "AVAILABLE",
            name: "Product 20",
            thumbnailUrl:
              "https://images.unsplash.com/photo-1572700433449-72c797656fe5",
            price: {
              amount: 420000,
              unit: "VND",
            },
            description: "Product 20 description",
            type: "NORMAL",
            remainingQuantity: 30,
            publishDatetime: "2023-06-12T17:08:00Z",
            deliveryType: "SHIP",
            quantity: 23,
          },
          {
            id: "456150767569299395",
            status: "AVAILABLE",
            name: "Product 19",
            thumbnailUrl:
              "https://images.unsplash.com/photo-1584448097764-374f81551427",
            price: {
              amount: 860000,
              unit: "VND",
            },
            description: "Product 19 description",
            type: "NORMAL",
            remainingQuantity: 20,
            publishDatetime: "2023-06-12T17:08:00Z",
            deliveryType: "SHIP",
            quantity: 23,
          },
        ],
      },
      {
        artist: {
          id: "455926865693447335",
          username: "artist04",
          displayName: "Artist 04",
        },
        items: [
          {
            id: "456149411819252484",
            status: "AVAILABLE",
            name: "Product 13",
            thumbnailUrl:
              "https://images.unsplash.com/photo-1654590707086-c6a0abc45c53",
            price: {
              amount: 34000,
              unit: "VND",
            },
            description: "Product 13 description",
            type: "NORMAL",
            remainingQuantity: 100,
            publishDatetime: "2023-06-12T17:08:00Z",
            deliveryType: "SHIP",
            quantity: 23,
          },
        ],
      },
      {
        artist: {
          id: "455926848870096317",
          username: "artist03",
          displayName: "Artist 03",
        },
        items: [
          {
            id: "456147912825331777",
            status: "AVAILABLE",
            name: "Product 10",
            thumbnailUrl:
              "https://images.unsplash.com/photo-1577627444534-b38e16c9d796",
            price: {
              amount: 30000,
              unit: "VND",
            },
            description: "Product 10 description",
            type: "NORMAL",
            remainingQuantity: 200,
            publishDatetime: "2023-06-12T17:08:00Z",
            deliveryType: "SHIP",
            quantity: 23,
          },
        ],
      },
    ],
  };

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
      item.items.reduce((acc, cartItem) => acc + cartItem.price.amount, 0),
    0
  );

  return (
    <div className="cart-page">
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
              dispatch={dispatch}
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
    </div>
  );
};

export default CartPage;
