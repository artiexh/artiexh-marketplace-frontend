import { TableColumns } from "@/types/Table";
import { Table, TableProps } from "@mantine/core";
import { tableDataMapper } from "./tableMapper";
import { useRouter } from "next/router";

interface ITableComponentProps<T> {
  columns: any[];
  data?: any[];
  tableProps?: TableProps;
}

const TableComponent = <T,>({
  columns,
  data,
  tableProps,
}: ITableComponentProps<T>) => {
  const router = useRouter();

  const actionMapper = (
    action?: string
  ): ((record: any) => void) | undefined => {
    if (!action) return undefined;
    switch (action) {
      case "SEE_DETAIL":
        return (record) => {
          console.log(record);
        };
      case "EDIT":
        return (record) => {
          console.log(record);
        };
    }
  };

  return (
    <div className="table-component w-full">
      <Table {...tableProps}>
        <thead>
          <tr className="!text-[#AFAFAF]">
            {columns.map(({ key, title, className }) => (
              <th key={key} className={className}>
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <tr key={item?.id || index}>
              {columns.map((column) => (
                <td key={column.key} className={column.className}>
                  {tableDataMapper(column, item, actionMapper(column?.action))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TableComponent;
