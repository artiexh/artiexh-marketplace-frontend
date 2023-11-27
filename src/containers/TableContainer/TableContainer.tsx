import TableComponent from "@/components/TableComponent";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { TableColumns } from "@/types/Table";
import { Pagination, TableProps } from "@mantine/core";
import React, { useState } from "react";
import useSWR from "swr";

type ITableContainerProps<T> = {
  columns: TableColumns<T>;
  fetchKey: string;
  pagination?: boolean;
  tableProps?: TableProps;
  fetcher: (currentPage: number) => any;
  className?: string;
  header?: (response?: PaginationResponseBase<any[]>) => React.ReactNode;
};

const TableContainer = <T,>({
  columns,
  fetchKey,
  pagination,
  fetcher,
  tableProps,
  header,
}: ITableContainerProps<T>) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  //TODO: replace fetcher later, and replace any -> T too
  const { data: response } = useSWR<
    CommonResponseBase<PaginationResponseBase<any>>
  >(`/page_url/${fetchKey}?page=${currentPage}`, () => fetcher(currentPage));

  console.log(response);

  return (
    <div className="py-5 px-7 bg-white shadow rounded-lg">
      {header && header(response?.data)}
      <div className="flex flex-col items-center gap-4 w-full">
        <TableComponent
          columns={columns}
          data={response?.data.items}
          tableProps={tableProps}
        />
        {pagination && (
          <Pagination
            value={currentPage}
            onChange={setCurrentPage}
            //TODO: change this to total of api call later
            total={response?.data.totalPage ?? 1}
            boundaries={2}
          />
        )}
      </div>
    </div>
  );
};

export default TableContainer;
