import OrderCard from "@/components/OrderCard";
import { ORDER_STATUS } from "@/constants/common";
import axiosClient from "@/services/backend/axiosClient";
import { Order, TotalOrder } from "@/types/Order";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { getQueryString } from "@/utils/formatter";
import { Badge } from "@mantine/core";
import clsx from "clsx";
import { useState } from "react";
import useSWR from "swr";
import { Pagination } from "@mantine/core";
import OrderPaymentCard from "@/components/OrderPaymentCard";

export default function OrderTab() {
  // readonly

  const [params, setParams] = useState<{ [key: string]: any }>({
    pageSize: 5,
    pageNumber: 1,
    sortBy: "id",
    sortDirection: "DESC",
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

  const { data: orders } = useSWR<any>([JSON.stringify(params)], async () => {
    try {
      const { data } = (
        await axiosClient.get<
          CommonResponseBase<PaginationResponseBase<Order | TotalOrder>>
        >(
          `/user/${
            params.status === "PAYING" ? "order" : "campaign-order"
          }?${getQueryString(params, ["id"])}`
        )
      ).data;
      // console.log(data.items);
      return data;
    } catch (err) {
      console.log(err);
      return [];
    }
  });

  console.log(orders);

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
      <div className="order-card-list flex flex-col gap-6 mt-10">
        {orders?.items?.length ? (
          orders?.items?.map((order: any) =>
            params.status !== "PAYING" ? (
              <OrderCard key={order.id} order={order} />
            ) : (
              <OrderPaymentCard key={order.id} order={order} />
            )
          )
        ) : (
          <div className="mt-20 text-center">Chưa có đơn hàng</div>
        )}
      </div>
      <div className="flex justify-end">
        <Pagination
          total={orders?.totalPage ?? 1}
          value={params.pageNumber}
          onChange={(value) =>
            setParams({
              ...params,
              pageNumber: value,
            })
          }
          classNames={{
            control: "[&[data-active]]:!text-white",
          }}
        />
      </div>
    </div>
  );
}
