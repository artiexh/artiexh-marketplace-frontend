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
import NotFoundComponent from "@/components/NotFoundComponents/NotFoundComponent";
import { notfoundMessages } from "@/constants/notfoundMesssages";

export default function OrderTab() {
  // readonly

  const [params, setParams] = useState<{ [key: string]: any }>({
    pageSize: 5,
    pageNumber: 1,
    sortBy: "id",
    sortDirection: "DESC",
    status: "PAYING",
    from: null,
    to: null,
  });

  const setField = (key: string, value: string | null) => {
    setParams({
      ...params,
      [key]: value,
    });
  };

  const { data: orders, mutate } = useSWR<any>(
    [JSON.stringify(params)],
    async () => {
      const { data } = (
        await axiosClient.get<
          CommonResponseBase<PaginationResponseBase<Order | TotalOrder>>
        >(
          `/user/${
            params.status === "PAYING" ? "order" : "campaign-order"
          }?${getQueryString(params, ["id"])}`
        )
      ).data;

      return data;
    }
  );

  return (
    <div className="user-profile-page">
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
              <OrderPaymentCard key={order.id} order={order} mutate={mutate} />
            )
          )
        ) : (
          <NotFoundComponent title={notfoundMessages.NOT_FOUND_ORDERS} />
        )}
      </div>
      <div className="flex justify-end mt-4">
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
