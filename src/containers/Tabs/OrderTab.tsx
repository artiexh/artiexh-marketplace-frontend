import { ORDER_STATUS } from "@/constants/common";
import { Badge } from "@mantine/core";
import { useState } from "react";
import clsx from "clsx";
import useSWR from "swr";
import axiosClient from "@/services/backend/axiosClient";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { Order } from "@/types/Order";
import OrderCard from "@/components/OrderCard";
import { getQueryString } from "@/utils/formatter";

export default function OrderTab() {
  // readonly

  const [params, setParams] = useState<{ [key: string]: any }>({
    pageSize: 5,
    pageNumber: 1,
    sortDirection: "ASC",
    status: null,
    from: null,
    to: null,
  });

  const setField = (key: string, value: string | null) => {
    setParams({
      ...params,
      [key]: value,
    });
  };

  const { data: orders } = useSWR([JSON.stringify(params)], async () => {
    try {
      const { data } = (
        await axiosClient.get<
          CommonResponseBase<PaginationResponseBase<Order>>
        >("/user/campaign-order?" + getQueryString(params, ["id"]))
      ).data;
      // console.log(data.items);
      return data.items ?? [];
    } catch (err) {
      console.log(err);
      return [];
    }
  });

  return (
    <div className="user-profile-page">
      <Badge
        className={clsx(
          "mr-3 cursor-pointer",
          !params.status && "bg-primary text-white"
        )}
        key={"ALL"}
        onClick={() => setField("status", null)}
      >
        Tất cả
      </Badge>
      {Object.values(ORDER_STATUS).map((orderStatus) => (
        <Badge
          className={clsx(
            "mr-3 cursor-pointer",
            orderStatus.code === params.status && "bg-primary text-white"
          )}
          key={orderStatus.code}
          onClick={() => setField("status", orderStatus.code)}
        >
          {orderStatus.name}
        </Badge>
      ))}
      <div className="order-card-list">
        {orders?.length ? (
          orders?.map((order) => <OrderCard key={order.id} order={order} />)
        ) : (
          <div className="mt-20 text-center">Chưa có đơn hàng</div>
        )}
      </div>
    </div>
  );
}
