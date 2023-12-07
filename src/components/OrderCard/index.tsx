import { ORDER_STATUS, ORDER_STATUS_ENUM } from "@/constants/common";
import { ROUTE } from "@/constants/route";
import { Order } from "@/types/Order";
import { currencyFormatter, dateFormatter } from "@/utils/formatter";
import { Divider } from "@mantine/core";
import { useRouter } from "next/router";
import ImageWithFallback from "../ImageWithFallback/ImageWithFallback";
import { getOrderStatusStylingClass } from "@/utils/mapper";
import clsx from "clsx";

type OrderCard = {
  order: Order;
};

export default function OrderCard({ order }: OrderCard) {
  const router = useRouter();

  return (
    <div
      className="order-card bg-white cursor-pointer"
      onClick={() => router.push(`${ROUTE.MY_PROFILE}/order/${order.id}`)}
    >
      <div className="order-card-header p-4 flex justify-between">
        <div>
          <span className="font-bold">{order.campaignSale.name}</span>
          <span className="ml-4">
            (Ngày tạo:{" "}
            {dateFormatter(new Date(order.createdDate).toISOString())})
          </span>
        </div>
        <div>
          <div
            className={clsx(
              "text-white font-semibold py-1 px-2 rounded-xl",
              getOrderStatusStylingClass(
                ORDER_STATUS[order.status as ORDER_STATUS_ENUM].code
              )
            )}
          >
            {
              //@ts-ignore
              ORDER_STATUS[order.status]?.name
            }
          </div>
        </div>
      </div>
      <Divider />
      <div className="order-card-body p-4 flex justify-between">
        <div className="flex items-center">
          <ImageWithFallback
            fallback="/assets/default-thumbnail.jpg"
            className="aspect-square object-cover"
            src={order.campaignSale.thumbnailUrl}
            width={100}
            alt="product-img"
          />
          <div className="ml-4">
            <div>{order.campaignSale.name}</div>
          </div>
        </div>
        {/* <div className="self-end">{currencyFormatter(200000)}</div> */}
      </div>
    </div>
  );
}
