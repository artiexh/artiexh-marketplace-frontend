import { ORDER_STATUS } from "@/constants/common";
import { Badge } from "@mantine/core";
import { useState } from "react";
import clsx from "clsx";
import { useSWR } from "swr";
import { useSearchParams } from "next/navigation";

export default function OrderTab() {
  const [status, setStatus] = useState(ORDER_STATUS.PAYING.code);
  const searchParams = useSearchParams();

  // console.log(searchParams);

  for (const [key, value] of searchParams.entries()) {
    console.log(`${key}, ${value}`);
  }

  const [params, set  Params] = useState({
    pageSize: 5,
    pageNumber: 0,
    sortDirection: "ASC",
    status: ORDER_STATUS.PAYING.code,
    from: null,
    to: null,
  });

  // const { data: orders } = useSWR([JSON.stringify(params)], () => {
  //   try {
  //     const data = axios.get()
  //   }
  // });
  return (
    <div className="user-profile-page">
      {Object.values(ORDER_STATUS).map((orderStatus) => (
        <Badge
          className={clsx(
            "mr-3",
            orderStatus.code === status && "bg-primary text-white"
          )}
          key={orderStatus.code}
          onClick={() => setStatus(orderStatus.code)}
        >
          {orderStatus.name}
        </Badge>
      ))}
    </div>
  );
}
