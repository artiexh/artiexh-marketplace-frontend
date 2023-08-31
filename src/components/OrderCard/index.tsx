import { Order } from "@/types/Order";
import { Divider } from "@mantine/core";
import img from "../../../public/assets/carue.png";
import Image from "next/image";

type OrderCard = {
  order: Order;
};

export default function OrderCard({ order }: OrderCard) {
  return (
    <div className="order-card bg-white my-4">
      <div className="order-card-header p-4">
        <div>
          <span className="font-bold">{order.shop.shopName}</span>
          <span className="ml-4">
            (Created day: {new Date(order.createdDate).toDateString()})
          </span>
        </div>
      </div>
      <Divider />
      <div className="order-card-body p-4 flex justify-between">
        <div className="flex">
          <Image
            className="aspect-square"
            src={img}
            width={100}
            alt="product-img"
          />
          <div className="ml-4">
            <div>This is a super long product name</div>
            <div>x3</div>
          </div>
        </div>
        <div className="self-end">200000VND</div>
      </div>
    </div>
  );
}
