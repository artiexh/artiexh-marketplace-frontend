import { ORDER_STATUS } from "@/constants/common";
import { ROUTE } from "@/constants/route";
import { Order } from "@/types/Order";
import { Divider } from "@mantine/core";
import { useRouter } from "next/router";
import img from "../../../public/assets/carue.png";
import ImageWithFallback from "../ImageWithFallback/ImageWithFallback";

type OrderCard = {
  order: Order;
};

export default function OrderCard({ order }: OrderCard) {
  const router = useRouter();

  return (
    <div
      className="order-card bg-white my-4 cursor-pointer"
      onClick={() => router.push(`${ROUTE.MY_PROFILE}/order/${order.id}`)}
    >
      <div className="order-card-header p-4 flex justify-between">
        <div>
          <span className="font-bold">{order.campaignSale.name}</span>
          <span className="ml-4">
            (Created day: {new Date(order.createdDate).toDateString()})
          </span>
        </div>
        <div>
          <div>
            {
              //@ts-ignore
              ORDER_STATUS[order.status]?.name
            }
          </div>
        </div>
      </div>
      <Divider />
      <div className="order-card-body p-4 flex justify-between">
        <div className="flex">
          <ImageWithFallback
            fallback="/assets/default-thumbnail.jpg"
            className="aspect-square"
            src={img.src}
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
