import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import TableComponent from "@/components/TableComponent";
import { orderProductColumns } from "@/constants/Columns/orderColumn";
import { NOTIFICATION_TYPE } from "@/constants/common";
import { ROUTE } from "@/constants/route";
import axiosClient from "@/services/backend/axiosClient";
import { getPaymentLink } from "@/services/backend/services/cart";
import { cancelOrderApi } from "@/services/backend/services/order";
import AuthWrapper from "@/services/guards/AuthWrapper";
import { TotalOrder } from "@/types/Order";
import { CommonResponseBase } from "@/types/ResponseBase";
import { errorHandler } from "@/utils/errorHandler";
import { currencyFormatter } from "@/utils/formatter";
import { getNotificationIcon } from "@/utils/mapper";
import { Button, Divider, Grid } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconChevronLeft } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import useSWR from "swr";

function OrderDetailPage() {
  const params = useSearchParams();
  const router = useRouter();

  const { data, isLoading, mutate } = useSWR([params?.get("id")], async () => {
    try {
      const { data } = await axiosClient.get<CommonResponseBase<TotalOrder>>(
        `/user/order/${params?.get("id")}`
      );

      return data?.data ?? null;
    } catch (err: any) {
      if (err.response.status === 404) {
        router.push(`${ROUTE.MY_PROFILE}`);
      }
      return;
    }
  });

  const cancelOrderMutation = useMutation({
    mutationFn: async (id: string) => {
      await cancelOrderApi(id);
    },
    onSuccess: () => {
      notifications.show({
        message: "Huỷ đơn thành công",
        ...getNotificationIcon(NOTIFICATION_TYPE.SUCCESS),
      });
    },
    onError: (e) => {
      errorHandler(e);
    },
    onSettled: () => {
      mutate();
    },
  });

  const paymentMutation = useMutation({
    mutationFn: async (id: string) => {
      const paymentLink = await getPaymentLink(id);

      if (!paymentLink) throw new Error("Không tìm thấy link thanh toán");

      return paymentLink;
    },
    onSuccess: (data) => {
      window.location.replace(data);
    },
    onError: (e) => {
      errorHandler(e);
    },
    onSettled: () => {
      mutate();
    },
  });

  if (!data) {
    <div>Không tìm thấy đơn hàng!</div>;
  }

  return (
    <div className="order-detail-page bg-white">
      <div className="p-10 flex justify-between">
        <div
          className="flex cursor-pointer"
          onClick={() => router.push(`${ROUTE.MY_PROFILE}`)}
        >
          <div className="mr-1">
            <IconChevronLeft />
          </div>
          <div>Trở về</div>
        </div>
        <div>Mã đơn: {data?.id}</div>
      </div>
      <div className="p-10">
        <div className="user-info mr-4">
          <div className="font-bold text-[24px] mb-1 text-primary">
            Địa chỉ nhận hàng
          </div>
          <div>
            <span className="font-bold">Tên người nhận: </span>
            {data?.deliveryName}
          </div>
          <div>
            <span className="font-bold">Số điện thoại: </span>
            {data?.deliveryTel}
          </div>
          <div>
            <span className="font-bold">Địa chỉ: </span>
            <span>{`${data?.deliveryAddress}, ${data?.deliveryWard}, ${data?.deliveryDistrict}, ${data?.deliveryProvince}`}</span>
          </div>
        </div>
      </div>
      {data?.currentTransaction ? (
        <div>
          <div className="p-10">
            <div className="font-bold text-[24px] mb-1 text-primary">
              Tình trạng thanh toán
            </div>
            <div>
              <span className="font-bold">Mã giao dịch: </span>
              {data.currentTransaction.transactionNo}
            </div>
            <div>
              <span className="font-bold">Tổng cộng: </span>
              {currencyFormatter(data.currentTransaction.priceAmount)}
            </div>
            <div>
              <span className="font-bold">Hình thức: </span>
              {data.currentTransaction.cardType}
            </div>
            <div>
              <span className="font-bold">Ngày thanh toán: </span>
              {new Date(data.currentTransaction.payDate).toLocaleDateString()}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="p-10 pb-2">
        <div className="font-bold text-[24px] mb-4 text-primary">
          Chi tiết đơn hàng
        </div>
        <div className="flex flex-col gap-10">
          {data?.campaignOrders
            .sort((a, b) => Number(a.id) - Number(b.id))
            .map((order) => (
              <div key={order.id} className="shadow-sm p-4">
                <div>
                  <div className="flex items-center justify-between px-4">
                    <div className="flex items-center">
                      <div>
                        <ImageWithFallback
                          className="rounded-full mr-4 aspect-square"
                          src={order.campaignSale.thumbnailUrl}
                          width={60}
                          height={60}
                          alt="shop-img"
                        />
                      </div>
                      <div className="flex flex-col">
                        <div
                          className="px-0 text-lg cursor-pointer"
                          onClick={() =>
                            router.push(`/campaigns/${order.campaignSale.id}`)
                          }
                        >
                          {order.campaignSale.name}
                        </div>
                        <span className="text-sm text-gray-500">
                          Artist: {order.campaignSale.owner.username}
                        </span>
                      </div>
                    </div>
                    <div
                      className="font-semibold text-primary cursor-pointer"
                      onClick={() =>
                        router.push(`${ROUTE.MY_PROFILE}/order/${order.id}`)
                      }
                    >
                      Xem đơn hàng
                    </div>
                  </div>
                  <Divider className="my-4" />
                  <div className="flex flex-col gap-6">
                    <TableComponent
                      columns={orderProductColumns}
                      data={order.orderDetails
                        .sort((a, b) => Number(a.id) - Number(b.id))
                        .map((el) => ({
                          ...el,
                          onClickView: () =>
                            router.push(
                              `/product/${order.campaignSale.id}_${el.productCode}`
                            ),
                        }))}
                    />
                  </div>
                  <div className="flex justify-end px-3">
                    <div className="text-sm">
                      <span className="font-semibold">Tiền vận chuyển:</span>{" "}
                      {currencyFormatter(order.shippingFee)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          {data && (
            <div className="flex justify-end text-lg mt-12 mb-4 mr-4">
              <Grid className="w-[400px]">
                <Grid.Col span={6} className="font-semibold text-base">
                  Tổng cộng (sản phẩm):
                </Grid.Col>
                <Grid.Col span={6} className="text-end text-base">
                  {currencyFormatter(
                    data?.campaignOrders.reduce(
                      (acc, item) =>
                        acc +
                        item.orderDetails.reduce(
                          (acc, order) =>
                            acc + order.price.amount * order.quantity,
                          0
                        ),
                      0
                    )
                  )}
                </Grid.Col>
                <Grid.Col span={6} className="font-semibold text-base">
                  Tiền vận chuyển:
                </Grid.Col>
                <Grid.Col span={6} className="text-end text-base">
                  {currencyFormatter(
                    data?.campaignOrders.reduce(
                      (acc, item) => acc + item.shippingFee,
                      0
                    )
                  )}
                </Grid.Col>
                <Divider className="bg-gray-300" />
                <Grid.Col span={6} className="font-semibold text-base">
                  Tổng cộng (thanh toán):
                </Grid.Col>
                <Grid.Col
                  span={6}
                  className="text-end text-base font-semibold text-red-600"
                >
                  {currencyFormatter(
                    data.campaignOrders.reduce(
                      (acc, item) =>
                        acc +
                        item.orderDetails.reduce(
                          (acc, order) =>
                            acc + order.price.amount * order.quantity,
                          0
                        ) +
                        item.shippingFee,
                      0
                    )
                  )}
                </Grid.Col>
              </Grid>
            </div>
          )}
        </div>
      </div>
      {data?.campaignOrders[0].status === "PAYING" && (
        <div className="px-10">
          <div className="flex justify-end mt-20 pb-10 gap-x-4">
            <Button
              variant="outline"
              loading={cancelOrderMutation.isLoading}
              disabled={paymentMutation.isLoading}
              onClick={() => cancelOrderMutation.mutateAsync(data!.id)}
            >
              Huỷ đơn
            </Button>
            <Button
              variant="default"
              className="!bg-primary !text-white"
              disabled={cancelOrderMutation.isLoading}
              loading={paymentMutation.isLoading}
              onClick={() => paymentMutation.mutate(data.id)}
            >
              Thanh toán
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

OrderDetailPage.getLayout = function getLayout(page: any) {
  return <Wrapper>{page}</Wrapper>;
};

function Wrapper({ children }: { children: any }) {
  const router = useRouter();
  return <AuthWrapper router={router}>{children}</AuthWrapper>;
}

export default OrderDetailPage;
