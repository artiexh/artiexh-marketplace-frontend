import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import TableComponent from "@/components/TableComponent";
import { orderProductColumns } from "@/constants/Columns/orderColumn";
import {
  ORDER_HISTORY_CONTENT_MAP,
  ORDER_STATUS,
  ORDER_STATUS_ENUM,
} from "@/constants/common";
import { ROUTE } from "@/constants/route";
import axiosClient from "@/services/backend/axiosClient";
import AuthWrapper from "@/services/guards/AuthWrapper";
import { Order } from "@/types/Order";
import { CommonResponseBase } from "@/types/ResponseBase";
import { currencyFormatter } from "@/utils/formatter";
import { getOrderStatusStylingClass } from "@/utils/mapper";
import { Divider, Grid, Stepper } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import useSWR from "swr";

function OrderDetailPage() {
  const params = useSearchParams();
  const router = useRouter();

  const { data, isLoading, mutate } = useSWR([params?.get("id")], async () => {
    try {
      const { data } = await axiosClient.get<CommonResponseBase<Order>>(
        `/user/campaign-order/${params?.get("id")}`
      );

      return data?.data;
    } catch (err: any) {
      if (err.response.status === 404) {
        router.push(`${ROUTE.MY_PROFILE}`);
      }
      return;
    }
  });

  if (!data) {
    <div>Không tìm thấy đơn hàng!</div>;
  }

  return (
    <div className="order-detail-page bg-white">
      <div className="p-10 flex justify-between">
        <div
          className="flex cursor-pointer items-center"
          onClick={() => router.push(`${ROUTE.MY_PROFILE}`)}
        >
          <div className="mr-1">
            <IconChevronLeft />
          </div>
          <div>Trở về</div>
        </div>
        <div>
          <span>Mã đơn: {data?.order?.id}</span>{" "}
          {data?.status && (
            <span
              className={clsx(
                getOrderStatusStylingClass(data?.status),
                "ml-4 px-3 py-1 rounded-xl text-base font-semibold text-white"
              )}
            >
              {ORDER_STATUS[data.status as ORDER_STATUS_ENUM].name}
            </span>
          )}
        </div>
      </div>
      <div className="p-10">
        <div className="user-info mr-4 flex justify-between items-center">
          <div className="font-bold text-[24px] text-primary">
            Tình trạng đơn hàng
          </div>
          <div
            className="cursor-pointer text-primary"
            onClick={() =>
              router.push(`/my-profile/total-order/${data?.order.id}`)
            }
          >
            Xem đơn hàng tổng
          </div>
        </div>
        <div className="order-info mt-10">
          <Stepper active={data?.orderHistories.length ?? 1}>
            {Object.keys(ORDER_HISTORY_CONTENT_MAP).map((status) => (
              <Stepper.Step label={status} key={status}></Stepper.Step>
            ))}
          </Stepper>
        </div>
      </div>
      <div className="flex justify-between p-10">
        <div className="user-info mr-4">
          <div className="font-bold text-[24px] mb-1 text-primary">
            Địa chỉ nhận hàng
          </div>
          {orderData?.shippingLabel && (
            <div className="mb-5">
              <div>
                <span className="font-bold">Đơn vị vận chuyển:</span> GHTK
              </div>
              <div>
                <span className="font-bold">Mã vận đơn:</span>{" "}
                {orderData.shippingLabel}
              </div>
              <span className="inline-block text-sm text-gray-500">
                Vui lòng sử dụng mã vận đơn để tra cứu trên trang web của đơn vị
                vận chuyển
              </span>
            </div>
          )}
          <div>
            <span className="font-bold">Tên người nhận: </span>
            {data?.order.deliveryName}
          </div>
          <div>
            <span className="font-bold">Số điện thoại: </span>
            {data?.order.deliveryTel}
          </div>
          <div>
            <span className="font-bold">Địa chỉ: </span>
            <span>
              {`${data?.order.deliveryAddress}, ${data?.order.deliveryWard}, ${data?.order.deliveryDistrict}, ${data?.order.deliveryProvince}`}
            </span>
          </div>
        </div>
      </div>
      <div className="p-10">
        <div className="font-bold text-[24px] mb-1 text-primary">
          Chi tiết đơn hàng:
        </div>
        <TableComponent
          columns={orderProductColumns}
          data={data?.orderDetails.map((el) => ({
            ...el,
            onClickView: () =>
              router.push(`/product/${data.campaignSale.id}_${el.productCode}`),
          }))}
        />
        <div className="flex justify-end text-lg mt-12 mb-4 mr-4">
          <Grid className="w-[400px]">
            <Grid.Col span={6} className="font-semibold text-base">
              Tổng cộng (sản phẩm):
            </Grid.Col>
            <Grid.Col span={6} className="text-end text-base">
              {data &&
                currencyFormatter(
                  data.orderDetails.reduce(
                    (acc, item) => acc + item.price.amount * item.quantity,
                    0
                  )
                )}
            </Grid.Col>
            <Grid.Col span={6} className="font-semibold text-base">
              Tiền vận chuyển:
            </Grid.Col>
            <Grid.Col span={6} className="text-end text-base">
              {currencyFormatter(data?.shippingFee ?? 0)}
            </Grid.Col>
            <Divider className="bg-gray-300" />
            <Grid.Col span={6} className="font-semibold text-base">
              Tổng cộng (thanh toán):
            </Grid.Col>
            <Grid.Col
              span={6}
              className="text-end text-base font-semibold text-red-600"
            >
              {data &&
                currencyFormatter(
                  data?.currentTransaction?.priceAmount ??
                    data?.orderDetails?.reduce(
                      (acc, item) => acc + item.price.amount * item.quantity,
                      0
                    ) + (data?.shippingFee ?? 0)
                )}
            </Grid.Col>
          </Grid>
        </div>
      </div>
      <div className="mt-10 px-10">
        <div className="flex justify-between items-center mb-6">
          <div className="text-xl font-semibold">Thông tin chiến dịch:</div>
          <div
            className="text-blue-500 cursor-pointer"
            onClick={() => router.push(`/campaigns/${data?.campaignSale.id}`)}
          >
            Xem chi tiết
          </div>
        </div>
        <div className="relative">
          <ImageWithFallback
            src={data?.campaignSale.thumbnailUrl}
            className="w-full h-[250px] object-cover brightness-[60%]"
            alt="campaign-img"
          />
          <div className="flex w-full absolute bottom-4 left-4 !text-white">
            <div>
              <div className="text-2xl mt-4">
                <span className="font-semibold">Tên chiến dịch:</span>{" "}
                {data?.campaignSale.name}
              </div>
              <div className="text-lg  mt-2">
                <span className="font-semibold">Tác giả:</span>{" "}
                {data?.campaignSale.owner.displayName}
              </div>
              {data?.campaignSale.createdDate && (
                <div className="text-lg mt-2">
                  <span className="font-semibold">Diễn ra từ:</span>{" "}
                  {new Date(
                    data?.campaignSale.createdDate
                  ).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
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
