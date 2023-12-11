import { TotalOrder } from "@/types/Order";
import OrderCard from "../OrderCard";
import { Button, Divider } from "@mantine/core";
import { currencyFormatter } from "@/utils/formatter";
import { NOTIFICATION_TYPE } from "@/constants/common";
import { getPaymentLink } from "@/services/backend/services/cart";
import { getNotificationIcon } from "@/utils/mapper";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { errorHandler } from "@/utils/errorHandler";
import { cancelOrderApi } from "@/services/backend/services/order";
import { KeyedMutator } from "swr";
import { useRouter } from "next/router";

export default function OrderPaymentCard({
  order,
  mutate,
}: {
  order: TotalOrder;
  mutate: KeyedMutator<any>;
}) {
  const router = useRouter();
  const paymentMutation = useMutation({
    mutationFn: async (id: string) => {
      const paymentLink = await getPaymentLink(id);

      if (!paymentLink) throw new Error("Không tìm thấy link thanh toán");

      return paymentLink;
    },
    onSuccess: (data) => {
      if (data) {
        window.location.replace(data);
      }
    },
    onError: (e) => {
      errorHandler(e);
    },
    onSettled: () => {
      mutate();
    },
  });

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
                ) +
                item.shippingFee,
              0
            )
          )}
        </div>
      </div>
      <Divider className="my-2" />
      <div className="mx-4 my-6 flex justify-end gap-x-3">
        <Button
          variant="outline"
          onClick={() => router.push(`/my-profile/total-order/${order.id}`)}
        >
          Xem chi tiết
        </Button>
        <Button
          loading={paymentMutation.isLoading}
          className="bg-primary !text-white"
          onClick={() => paymentMutation.mutate(order.id)}
        >
          Thanh toán ngay
        </Button>
      </div>
    </div>
  );
}
