import TableComponent from "@/components/TableComponent";
import { fetcher } from "@/services/backend/axiosMockups/axiosMockupClient";
import { PaginationResponseBase } from "@/types/ResponseBase";
import { TableColumns } from "@/types/Table";
import { Pagination, TableProps } from "@mantine/core";
import clsx from "clsx";
import React, { Dispatch, SetStateAction, useState } from "react";
import useSWR from "swr";

type ITableContainerProps<T> = {
  columns: TableColumns<T>;
  pagination?: boolean;
  searchParams?: Record<string, string>;
  tableProps?: TableProps;
  fetchUrl: (currentPage: number) => string;
  className?: string;
  header?: (response?: PaginationResponseBase<any[]>) => React.ReactNode;
};

const TableContainer = <T,>({
  columns,
  pagination,
  searchParams = {},
  fetchUrl,
  tableProps,
  header,
}: ITableContainerProps<T>) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  //TODO: replace fetcher later, and replace any -> T too
  const { data: response } = useSWR<PaginationResponseBase<any[]>>(
    fetchUrl(currentPage),
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
