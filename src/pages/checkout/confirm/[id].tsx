import axiosClient from "@/services/backend/axiosClient";
import { Order } from "@/types/Order";
import { CommonResponseBase } from "@/types/ResponseBase";
import {
  IconCircleCheckFilled,
  IconAlertCircleFilled,
  IconAlertTriangleFilled,
} from "@tabler/icons-react";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { ROUTE } from "@/constants/route";
import { Button } from "@mantine/core";

const CheckoutConfirmPage = () => {
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
        router.push(ROUTE.HOME_PAGE);
      }
      return;
    }
  });

  const ButtonGroup = () => (
    <div className="flex mt-4 justify-center">
      <Button
        className="text-black border-black hover:bg-black hover:text-white w-[10rem] mr-4"
        onClick={() => router.push(ROUTE.HOME_PAGE)}
      >
        Trở về trang chủ
      </Button>
      <Button
        className="text-white bg-primary border-primary w-[10rem]"
        onClick={() => {
          router.push(data != null ? ROUTE.HOME_PAGE : ROUTE.CART);
        }}
      >
        {data != null ? "Kiểm tra đơn hàng" : "Quay lại giỏ hàng"}
      </Button>
    </div>
  );

  return (
    <div className="checkout-confirm-page">
      <div className="text-center mt-[20%]">
        {isLoading ? (
          <>
            <div>
              <div className="flex justify-center">
                <IconAlertTriangleFilled
                  width={150}
                  height={150}
                  className="!text-yellow-400"
                />
              </div>
              <div className="text-xl font-bold mt-6 mb-2">
                Đang xử lý! Bạn chờ xí nhé!
              </div>
            </div>
          </>
        ) : data != null ? (
          <>
            <div className="flex justify-center">
              <IconCircleCheckFilled
                width={150}
                height={150}
                className="!text-green-500"
              />
            </div>
            <div className="text-xl font-bold mt-6 mb-2">
              Đơn hàng của bạn với mã số {data.id} đang được xử lý!
            </div>
            <div>
              Vui lòng kiểm tra lại địa chỉ nhận hàng:{" "}
              {data.shippingAddress.address}
            </div>
            <div className="flex mt-4 justify-center">
              <ButtonGroup />
            </div>
          </>
        ) : (
          <>
            <div>
              <div className="flex justify-center">
                <IconAlertCircleFilled
                  width={150}
                  height={150}
                  className="!text-red-700"
                />
              </div>
              <div className="text-xl font-bold mt-6 mb-2">
                Đã có lỗi trong quá trình mua hàng! Vui lòng thử lại!
              </div>
              <ButtonGroup />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutConfirmPage;
