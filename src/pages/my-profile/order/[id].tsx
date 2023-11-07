import {
  NOTIFICATION_TYPE,
  ORDER_HISTORY_CONTENT_MAP,
  ORDER_STATUS,
} from "@/constants/common";
import { ROUTE } from "@/constants/route";
import axiosClient from "@/services/backend/axiosClient";
import { getPaymentLink } from "@/services/backend/services/cart";
import AuthWrapper from "@/services/guards/AuthWrapper";
import { Order } from "@/types/Order";
import { CommonResponseBase } from "@/types/ResponseBase";
import { getReadableWardAddress } from "@/utils/formatter";
import { getNotificationIcon } from "@/utils/mapper";
import { Divider, Text, Timeline } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconChevronLeft } from "@tabler/icons-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import useSWR from "swr";

function OrderDetailPage() {
  const params = useSearchParams();
  const router = useRouter();

  const { data, isLoading } = useSWR([params?.get("id")], async () => {
    try {
      const { data } = await axiosClient.get<CommonResponseBase<Order>>(
        `/user/campaign-order/${params?.get("id")}`
      );

      return data?.data ?? null;
    } catch (err: any) {
      if (err.response.status === 404) {
        router.push(`${ROUTE.PROFILE}/me`);
      }
      return;
    }
  });

  if (!data) {
    <div>Không tìm thấy đơn hàng!</div>;
  }

  const payment = async () => {
    if (data?.orderId) {
      const paymentLink = await getPaymentLink(data.orderId);

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

  const getDateBasedOnStatus = (status: string) => {
    let date = data?.orderHistories?.find(
      (history: any) => history?.status === status
    )?.datetime;

    if (date) {
      return new Date(date).toLocaleDateString();
    }
  };

  return (
    <div className="order-detail-page bg-white">
      <div className="p-10 flex justify-between">
        <div
          className="flex cursor-pointer"
          onClick={() => router.push(`${ROUTE.PROFILE}/me`)}
        >
          <div className="mr-1">
            <IconChevronLeft />
          </div>
          <div>Trở về</div>
        </div>
        <div>Mã đơn: {data?.id}</div>
      </div>
      <Divider />
      <div className="flex justify-between p-10">
        <div className="user-info mr-4">
          <div className="font-bold text-[24px] mb-1 text-primary">
            Tình trạng đơn hàng
          </div>
          {data?.status === ORDER_STATUS.PAYING.code ? (
            <div className="cursor-pointer mt-4 text-primary" onClick={payment}>
              Nhấn vào đây để tiến hàng thanh toán
            </div>
          ) : null}
        </div>
        <div className="order-info">
          <Timeline
            active={(data?.orderHistories.length ?? 1) - 1}
            bulletSize={24}
            lineWidth={2}
          >
            {Object.keys(ORDER_HISTORY_CONTENT_MAP).map((status) => (
              <Timeline.Item
                key={status}
                bullet={ORDER_HISTORY_CONTENT_MAP[status].icon}
                title={ORDER_HISTORY_CONTENT_MAP[status].content}
              >
                <Text size="xs" mt={4}>
                  {getDateBasedOnStatus(status)}
                </Text>
              </Timeline.Item>
            ))}
          </Timeline>
        </div>
      </div>
      <Divider />
      {/* <div className="flex justify-between p-10">
        <div className="user-info mr-4">
          <div className="font-bold text-[24px] mb-1 text-primary">
            Địa chỉ nhận hàng
          </div>

          <div>
            <span className="font-bold">Tên người nhận: </span>
            {data?.}
          </div>
          <div>
            <span className="font-bold">Số điện thoại: </span>
            {data?.shippingAddress.phone}
          </div>
          <div>
            <span className="font-bold">Địa chỉ: </span>
            <span>
              {`${data?.shippingAddress.address}, ${getReadableWardAddress(
                data?.shippingAddress.ward
              )}`}
            </span>
          </div>
        </div>
      </div> */}
      <Divider />
      <div>
        <div className="p-10">
          <div className="font-bold text-[24px] mb-1 text-primary">
            Thông tin shop:
          </div>
          <div className="flex items-center mb-4 bg-primary p-4">
            <div>
              <Image
                className="rounded-full mr-8 aspect-square"
                src={data?.campaign.thumbnailUrl ?? ""}
                width={60}
                height={60}
                alt="shop-img"
              />
            </div>
            <div className="text-white">{data?.campaign.name}</div>
          </div>
          <div>
            {/* <span className="font-bold">
              Địa chỉ: {data?.campaign.d}
            </span> */}
          </div>
        </div>
        <Divider />
      </div>
      <div className="p-10">
        <div className="font-bold text-[24px] mb-1 text-primary">
          Chi tiết đơn hàng:
        </div>
        {data?.orderDetails.map((orderDetail) => (
          <div
            className="flex justify-between items-center"
            key={orderDetail.id}
          >
            <div className="flex">
              <div>
                <Image
                  className="aspect-square rounded-lg mr-4"
                  src={orderDetail.thumbnailUrl ?? ""}
                  width={100}
                  height={100}
                  alt="order-img"
                />
              </div>
              <div>
                <div className="text-lg font-semibold">{orderDetail.name}</div>
                <div>{orderDetail.type}</div>
                <div>Số lượng: {orderDetail.quantity}</div>
              </div>
            </div>
            <div>
              <div>
                Tổng cộng: {orderDetail.price.amount * orderDetail.quantity}{" "}
                {orderDetail.price.unit}
              </div>
            </div>
          </div>
        ))}
      </div>
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
