import TableComponent from "@/components/TableComponent";
import { fetcher } from "@/services/backend/axiosMockups/axiosMockupClient";
import { PaginationResponseBase } from "@/types/ResponseBase";
import { TableColumns } from "@/types/Table";
import { Pagination, TableProps } from "@mantine/core";
import clsx from "clsx";
import React, { Dispatch, SetStateAction, useState } from "react";
import useSWR from "swr";

type ITableContainerProps<T> = {
  pathName: string;
  columns: TableColumns<T>;
  pagination?: boolean;
  pageSize?: number;
  searchParams?: Record<string, string>;
  setSearchParams?: Dispatch<SetStateAction<Record<string, string>>>;
  tableProps?: TableProps;
  className?: string;
  header?: (response?: PaginationResponseBase<any[]>) => React.ReactNode;
};

const TableContainer = <T,>({
  pathName,
  columns,
  pagination,
  pageSize = 5,
  searchParams = {},
  setSearchParams = (prev) => {},
  tableProps,
  header,
}: ITableContainerProps<T>) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  //TODO: replace fetcher later
  const { data: response } = useSWR<PaginationResponseBase<any[]>>(
    (pagination
      ? `/${pathName}?_page=${currentPage}&_limit=${pageSize}`
      : `/${pathName}`) + new URLSearchParams(searchParams).toString(),
    fetcher
  );

  return (
    <div className="py-5 px-7 bg-white rounded-lg">
      {header && header(response)}
      <div className={clsx("flex flex-col items-center gap-4 w-full")}>
        <TableComponent
          columns={columns}
          data={response?.data}
          tableProps={tableProps}
        />
        {pagination && (
          <Pagination
            value={currentPage}
            onChange={setCurrentPage}
            //TODO: change this to total of api call later
            total={response?.data?.[0]?.total || 10}
          />
        )}
      </div>
    </div>
  );
};

export default TableContainer;
