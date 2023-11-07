import { Order } from "@/types/Order";
import { Divider } from "@mantine/core";
import img from "../../../public/assets/carue.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { ROUTE } from "@/constants/route";
import { ORDER_STATUS } from "@/constants/common";
import ImageWithFallback from "../ImageWithFallback/ImageWithFallback";

type OrderCard = {
  order: Order;
};

export default function OrderCard({ order }: OrderCard) {
  const router = useRouter();

  return (
    <div
      className="order-card bg-white my-4 cursor-pointer"
      onClick={() => router.push(`${ROUTE.PROFILE}/order/${order.id}`)}
    >
      <div className="order-card-header p-4 flex justify-between">
        <div>
          <span className="font-bold">{order.campaign.name}</span>
          <span className="ml-4">
            (Created day:{" "}
            {new Date(
              order?.orderHistories.find(
                (el) => el.status === "CREATED"
              )?.datetime
            ).toDateString()}
            )
          </span>
        </div>
        <div>
          <div>{ORDER_STATUS[order.status].name}</div>
        </div>
      </div>
      <Divider />
      <div className="order-card-body p-4 flex justify-between">
        <div className="flex">
          <ImageWithFallback
            fallback="/assets/default-thumbnail.jpg"
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
