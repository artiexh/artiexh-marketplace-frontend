import { TotalOrder } from "@/types/Order";
import OrderCard from "../OrderCard";
import { Button, Divider } from "@mantine/core";
import { currencyFormatter } from "@/utils/formatter";
import { NOTIFICATION_TYPE } from "@/constants/common";
import { getPaymentLink } from "@/services/backend/services/cart";
import { getNotificationIcon } from "@/utils/mapper";
import { notifications } from "@mantine/notifications";

export default function OrderPaymentCard({ order }: { order: TotalOrder }) {
  const payment = async () => {
    if (order?.id) {
      const paymentLink = await getPaymentLink(order?.id);

      console.log(paymentLink);
      if (paymentLink) {
        window.location.replace(paymentLink);
      } else {
        notifications.show({
          message: "Không tìm thấy link thanh toán",
          ...getNotificationIcon(NOTIFICATION_TYPE.FAILED),
        });
      }
    }
  };

  return (
    <div className="order-payment-card bg-white shadow">
      <div>
        {order.campaignOrders?.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
      <Divider className="my-2" />
      <div className="flex m-4 justify-between">
        <div>
          {order.campaignOrders.reduce(
            (acc, item) => acc + item.orderDetails.length,
            0
          )}{" "}
          sản phẩm
        </div>
        <div>
          Tổng thanh toán:{" "}
          {currencyFormatter(
            order.campaignOrders.reduce(
              (acc, item) =>
                acc +
                item.orderDetails.reduce(
                  (acc, order) => acc + order.price.amount * order.quantity,
                  0
                ),
              0
            )
          )}
        </div>
      </div>
      <Divider className="my-2" />
      <div className="mx-4 my-6 flex justify-end">
        <Button className="bg-primary !text-white" onClick={payment}>
          Thanh toán ngay
        </Button>
      </div>
    </div>
  );
}
