import { fetcher } from "@/services/backend/axiosMockups/axiosMockupClient";
import { PaginationResponseBase } from "@/types/ResponseBase";
import { TableColumns } from "@/types/Table";
import { Table } from "@mantine/core";
import { Dispatch, SetStateAction, useState } from "react";
import useSWR from "swr";

interface ITableContainerProps {
  pathName: string;
  columns: TableColumns<any>;
  children?: any;
  pagination?: boolean;
  itemNumber?: number;
  searchParams?: any;
  forceRerender?: number;
  setSearchParams?: Dispatch<SetStateAction<object>>;
}

const TableContainer = ({
  pathName,
  columns,
  children,
  pagination,
  itemNumber,
  searchParams = {},
  forceRerender = 0,
  setSearchParams = (prev) => {},
}: ITableContainerProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentId, setCurrentId] = useState<number | string>(0);

  //TODO: replace fetcher later

  const {
    data: response,
    mutate: mutateTable,
    isLoading,
  } = useSWR<PaginationResponseBase<any[]>>(`/${pathName}`, fetcher);

  return (
    <div className="table-container">
      <Table>
        <thead>
          <tr>
            {columns.map(({ key, title }) => (
              <th key={key}>{title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {response?.data.map((item, index) => (
            <tr key={item?.id || index}>
              {columns.map((column) => {
                if (column?.render) {
                  return <td key={column.key}>{column.render(item)}</td>;
                }
                if (column?.dataIndex) {
                  return <td key={column.key}>{item?.[column?.dataIndex]}</td>;
                }
                return null;
              })}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TableContainer;
