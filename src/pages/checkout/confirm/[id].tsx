import axiosClient from "@/services/backend/axiosClient";
import { Order, TotalOrder } from "@/types/Order";
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
import { PAYMENT_METHOD } from "@/constants/common";
import { useMemo } from "react";
import AuthWrapper from "@/services/guards/AuthWrapper";

const CheckoutConfirmPage = () => {
  const params = useSearchParams();
  const router = useRouter();
  const id = params?.get("id");

  const { data, isLoading } = useSWR([params?.get("id")], async () => {
    if (id == null) {
      return undefined;
    }

    try {
      const { data } = await axiosClient.get<CommonResponseBase<TotalOrder>>(
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
          router.push(
            data != null ? `${ROUTE.PROFILE}/total-order/${id}` : ROUTE.CART
          );
        }}
      >
        {data != null ? "Kiểm tra đơn hàng" : "Quay lại giỏ hàng"}
      </Button>
    </div>
  );

  const confirmContent = useMemo(
    () => getConfirmContent(data, isLoading),
    [data, isLoading]
  );

  console.log(confirmContent);

  return (
    <div className="checkout-confirm-page">
      <div className="text-center mt-[20%]">
        <div className="flex justify-center">{confirmContent.icon}</div>
        <div className="text-xl font-bold mt-6 mb-2">
          {confirmContent.mainContent}
        </div>
        <div>{confirmContent.subContent}</div>
        <div className="flex mt-4 justify-center">
          <ButtonGroup />
        </div>
      </div>
    </div>
  );
};

const getConfirmContent = (
  data: TotalOrder | undefined,
  isLoading: boolean
) => {
  console.log(data);
  const confirmContent = {
    icon: (
      <IconAlertCircleFilled
        width={150}
        height={150}
        className="!text-red-700"
      />
    ),
    mainContent: "Đơn hàng không tồn tại!",
    subContent: "",
  };

  if (isLoading) {
    confirmContent.icon = (
      <IconAlertTriangleFilled
        width={150}
        height={150}
        className="!text-yellow-400"
      />
    );
    confirmContent.mainContent = "Đang xử lý! Bạn chờ xí nhé!";
  }

  if (data) {
    if (data.currentTransaction != null) {
      confirmContent.icon = (
        <IconCircleCheckFilled
          width={150}
          height={150}
          className="!text-green-500"
        />
      );
      confirmContent.mainContent = "Thanh toán thành công!";
      confirmContent.subContent = `Mã đơn hàng: ${data.id}`;
    } else {
      if (data?.paymentMethod === PAYMENT_METHOD.CASH) {
        confirmContent.icon = (
          <IconCircleCheckFilled
            width={150}
            height={150}
            className="!text-green-500"
          />
        );
        confirmContent.mainContent =
          "Đơn hàng đã được xử lý thành công. Vui lòng chờ shop phản hồi";
        confirmContent.subContent = `Mã đơn hàng: ${data.id}`;
      } else {
        confirmContent.icon = (
          <IconAlertTriangleFilled
            width={150}
            height={150}
            className="!text-red-700"
          />
        );
        confirmContent.mainContent =
          "Đơn hàng chưa được thanh toán thành công! Vui lòng thử lại!";
        confirmContent.subContent = `Mã đơn hàng: ${data.id}`;
      }
    }
  }

  return confirmContent;
};

CheckoutConfirmPage.getLayout = function getLayout(page: React.ReactNode) {
  return <Wrapper>{page}</Wrapper>;
};

function Wrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return <AuthWrapper router={router}>{children}</AuthWrapper>;
}

export default CheckoutConfirmPage;
