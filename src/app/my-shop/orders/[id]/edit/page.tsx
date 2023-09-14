"use client";

import { ROUTE } from "@/constants/route";
import axiosClient from "@/services/backend/axiosClient";
import { ArtistOrderDetail } from "@/types/Order";
import { CommonResponseBase } from "@/types/ResponseBase";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Timeline, Text, Divider, Button } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import Image from "next/image";
import {
  NOTIFICATION_TYPE,
  ORDER_HISTORY_CONTENT_MAP,
  ORDER_STATUS,
} from "@/constants/common";
import { useState } from "react";
import { updateShippingInformation } from "@/services/backend/services/order";
import { notifications } from "@mantine/notifications";
import { getNotificationIcon } from "@/utils/mapper";

const ShopEditOrderPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();

  const { data, isLoading, mutate } = useSWR([params.id], async () => {
    try {
      const { data } = await axiosClient.get<
        CommonResponseBase<ArtistOrderDetail>
      >(`/artist/order-shop/${params.id}`);

      return data?.data ?? null;
    } catch (err: any) {
      if (err.response.status === 404) {
        router.push(`${ROUTE.SHOP}/orders`);
      }
      return;
    }
  });

  const [loading, setLoading] = useState<boolean>(false);

  const address = data?.shippingAddress;

  if (!data) {
    <div>Không tìm thấy đơn hàng!</div>;
  }

  const getDateBasedOnStatus = (status: string) => {
    let date = data?.orderHistories?.find(
      (history: any) => history?.status === status
    )?.datetime;

    if (date) {
      return new Date(date).toLocaleDateString();
    }
  };

  const updateShippingInformationHandler = async () => {
    if (data?.id) {
      setLoading(true);
      const result = await updateShippingInformation(data.id);

      console.log(result);

      if (result) {
        notifications.show({
          message: "Cập nhật thành công",
          ...getNotificationIcon(NOTIFICATION_TYPE["SUCCESS"]),
        });
      } else {
        notifications.show({
          message: "Cập nhật thất bại! Vui lòng thử lại",
          ...getNotificationIcon(NOTIFICATION_TYPE["FAILED"]),
        });
      }
      setLoading(false);
      mutate();
    }
  };

  return (
    <div className="order-detail-page bg-white mb-10">
      <div className="p-10 flex justify-between">
        <div
          className="flex cursor-pointer"
          onClick={() => router.push(`${ROUTE.SHOP}/orders`)}
        >
          <div className="mr-1">
            <IconChevronLeft />
          </div>
          <div>Trở về</div>
        </div>
        <div>Mã đơn: {data?.id}</div>
      </div>
      <Divider />
      <div className="p-10 flex justify-between">
        <div>
          <div className="font-bold text-[24px] mb-3 text-primary">
            Trạng thái đơn hàng
          </div>
          {/* <div>
            Tình trạng: {ORDER_STATUS[data?.status as any ?? "PREPARING"]?.name}
          </div> */}
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
        {data?.status === ORDER_STATUS.PREPARING.code && (
          <div onClick={updateShippingInformationHandler}>
            <Button className="bg-primary">Cập nhật thông tin giao hàng</Button>
          </div>
        )}
      </div>
      <Divider />
      <div className="flex justify-between p-10">
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
            <span>
              {`${address?.address}, ${address?.ward.fullName}, ${address?.ward.district.fullName}, ${address?.ward.district.province.fullName}`}
            </span>
          </div>
        </div>
        {/* <div className="order-info">
          <Timeline active={1} bulletSize={24} lineWidth={2}>
            <Timeline.Item
              bullet={<IconGitBranch size={12} />}
              title="New branch"
            >
              <Text color="dimmed" size="sm">
                You&apos;ve created new branch{" "}
                <Text variant="link" component="span" inherit>
                  fix-notifications
                </Text>{" "}
                from master
              </Text>
              <Text size="xs" mt={4}>
                2 hours ago
              </Text>
            </Timeline.Item>

            <Timeline.Item bullet={<IconGitCommit size={12} />} title="Commits">
              <Text color="dimmed" size="sm">
                You&apos;ve pushed 23 commits to
                <Text variant="link" component="span" inherit>
                  fix-notifications branch
                </Text>
              </Text>
              <Text size="xs" mt={4}>
                52 minutes ago
              </Text>
            </Timeline.Item>
            <Timeline.Item
              title="Pull request"
              bullet={<IconGitPullRequest size={12} />}
              lineVariant="dashed"
            >
              <Text color="dimmed" size="sm">
                You&apos;ve submitted a pull request
                <Text variant="link" component="span" inherit>
                  Fix incorrect notification message (#187)
                </Text>
              </Text>
              <Text size="xs" mt={4}>
                34 minutes ago
              </Text>
            </Timeline.Item>
            <Timeline.Item
              title="Code review"
              bullet={<IconMessageDots size={12} />}
            >
              <Text color="dimmed" size="sm">
                <Text variant="link" component="span" inherit>
                  Robert Gluesticker
                </Text>{" "}
                left a code review on your pull request
              </Text>
              <Text size="xs" mt={4}>
                12 minutes ago
              </Text>
            </Timeline.Item>
          </Timeline>
        </div> */}
      </div>
      <Divider />
      <div className="p-10">
        <div className="flex justify-between items-center">
          <div className="flex">
            <div>
              <Image
                className="aspect-square rounded-lg mr-3"
                src={data?.orderDetails[0].thumbnailUrl ?? ""}
                width={150}
                height={150}
                alt="order-img"
              />
            </div>
            <div>
              <div className="text-lg font-semibold">
                {data?.orderDetails[0]?.name}
              </div>
              <div>{data?.orderDetails[0].type}</div>
              <div>x{data?.orderDetails[0].quantity}</div>
            </div>
          </div>
          <div>
            <div>
              {data?.orderDetails[0].price.amount}{" "}
              {data?.orderDetails[0].price.unit}
            </div>
            <div>(Phương thức thanh toán: {data?.paymentMethod})</div>
          </div>
        </div>
      </div>
    </div>
  );
};

ShopEditOrderPage.getInitialProps = ({ query }: any) => {
  return { query };
};

export default ShopEditOrderPage;
