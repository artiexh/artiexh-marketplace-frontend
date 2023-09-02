import { ROUTE } from "@/constants/route";
import axiosClient from "@/services/backend/axiosClient";
import { Order } from "@/types/Order";
import { CommonResponseBase } from "@/types/ResponseBase";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import useSWR from "swr";

export default function OrderDetailPage() {
  const params = useSearchParams();
  const router = useRouter();

  const { data, isLoading } = useSWR([params?.get("id")], async () => {
    try {
      const { data } = await axiosClient.get<CommonResponseBase<Order>>(
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

  return (
    <div className="order-detail-page">
      <div className="user-info">
        <div className="font-bold text-xl">Địa chỉ nhận hàng</div>
        <div>{data?.shippingAddress.receiverName}</div>
        <div>{data?.shippingAddress.phone}</div>
        <div>{data?.shippingAddress.address}</div>
      </div>
      <div className="order-info"></div>
    </div>
  );
}
