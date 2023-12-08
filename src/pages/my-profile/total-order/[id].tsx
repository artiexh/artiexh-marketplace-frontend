import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import { NOTIFICATION_TYPE } from "@/constants/common";
import { ROUTE } from "@/constants/route";
import axiosClient from "@/services/backend/axiosClient";
import { getPaymentLink } from "@/services/backend/services/cart";
import AuthWrapper from "@/services/guards/AuthWrapper";
import { TotalOrder } from "@/types/Order";
import { CommonResponseBase } from "@/types/ResponseBase";
import { currencyFormatter } from "@/utils/formatter";
import { getNotificationIcon } from "@/utils/mapper";
import { Divider } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconChevronLeft } from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import useSWR from "swr";

function OrderDetailPage() {
  const params = useSearchParams();
  const router = useRouter();

  const { data, isLoading } = useSWR([params?.get("id")], async () => {
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

  const payment = async () => {
    if (data?.id) {
      const paymentLink = await getPaymentLink(data?.id);

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
      <Divider />
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
      <Divider />
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
              {data.currentTransaction.priceAmount} VND
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
          <Divider />
        </div>
      ) : (
        <></>
      )}
      <div className="p-10">
        <div className="font-bold text-[24px] mb-4 text-primary">
          Chi tiết đơn hàng
        </div>
        <div className="flex flex-col gap-10">
          {data?.campaignOrders.map((order) => (
            <div key={order.id}>
              <div>
                <div className="flex items-center justify-between bg-primary mb-4 p-4">
                  <div className="flex items-center">
                    <div>
                      <ImageWithFallback
                        className="rounded-full mr-8 aspect-square"
                        src={order.campaignSale.thumbnailUrl}
                        width={60}
                        height={60}
                        alt="shop-img"
                      />
                    </div>
                    <div className="text-white">{order.campaignSale.name}</div>
                  </div>
                  <div
                    className="text-white cursor-pointer"
                    onClick={() =>
                      router.push(`${ROUTE.MY_PROFILE}/order/${order.id}`)
                    }
                  >
                    Xem đơn hàng
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  {order.orderDetails.map((orderDetail) => (
                    <div
                      className="flex justify-between items-center"
                      key={orderDetail.id}
                    >
                      <div className="flex">
                        <div>
                          <ImageWithFallback
                            className="aspect-square rounded-lg mr-4"
                            src={orderDetail.thumbnailUrl ?? ""}
                            width={100}
                            height={100}
                            alt="order-img"
                          />
                        </div>
                        <div>
                          <div className="text-lg font-semibold">
                            {orderDetail.name}
                          </div>
                          <div>{orderDetail.type}</div>
                          <div>Số lượng: {orderDetail.quantity}</div>
                        </div>
                      </div>
                      <div>
                        <div>
                          Tổng cộng:{" "}
                          {currencyFormatter(
                            orderDetail.price.amount * orderDetail.quantity
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Divider className="mt-3" />
            </div>
          ))}
        </div>
      </div>
      {data?.campaignOrders[0].status === "PAYING" && (
        <div
          className="p-10 text-end font-semibold text-primary cursor-pointer"
          onClick={payment}
        >
          Nhấn vào đây để tiến hành thanh toán
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
