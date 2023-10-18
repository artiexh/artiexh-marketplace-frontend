import { ROUTE } from "@/constants/route";
import axiosClient from "@/services/backend/axiosClient";
import { TotalOrder } from "@/types/Order";
import { CommonResponseBase } from "@/types/ResponseBase";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Divider } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import Image from "next/image";
import { getReadableWardAddress } from "@/utils/formatter";
import AuthWrapper from "@/services/guards/AuthWrapper";

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
        router.push(`${ROUTE.PROFILE}/me`);
      }
      return;
    }
  });

  if (!data) {
    <div>Không tìm thấy đơn hàng!</div>;
  }

  const address = data?.shippingAddress;

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
      <div className="p-10">
        <div className="user-info mr-4">
          <div className="font-bold text-[24px] mb-1 text-primary">
            Địa chỉ nhận hàng
          </div>
          <div>
            <span className="font-bold">Tên người nhận: </span>
            {data?.shippingAddress.receiverName}
          </div>
          <div>
            <span className="font-bold">Số điện thoại: </span>
            {data?.shippingAddress.phone}
          </div>
          <div>
            <span className="font-bold">Địa chỉ: </span>
            <span>{`${address?.address}, ${getReadableWardAddress(
              address?.ward
            )}`}</span>
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
        {data?.orders.map((order) => (
          <div key={order.id}>
            <div>
              <div className="flex items-center justify-between bg-primary mb-4 p-4">
                <div className="flex items-center">
                  <div>
                    <Image
                      className="rounded-full mr-8 aspect-square"
                      src={order.shop.shopImageUrl}
                      width={60}
                      height={60}
                      alt="shop-img"
                    />
                  </div>
                  <div className="text-white">{order.shop.shopName}</div>
                </div>
                <div
                  className="text-white cursor-pointer"
                  onClick={() =>
                    router.push(`${ROUTE.PROFILE}/order/${order.id}`)
                  }
                >
                  Xem đơn hàng
                </div>
              </div>
              {order.orderDetails.map((orderDetail) => (
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
                      {orderDetail.price.amount * orderDetail.quantity}{" "}
                      {orderDetail.price.unit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Divider className="mt-3" />
          </div>
        ))}
      </div>
    </div>
  );
}

OrderDetailPage.getLayout = function getLayout(page: React.ReactNode) {
  return <Wrapper>{page}</Wrapper>;
};

function Wrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return <AuthWrapper router={router}>{children}</AuthWrapper>;
}

export default OrderDetailPage;
