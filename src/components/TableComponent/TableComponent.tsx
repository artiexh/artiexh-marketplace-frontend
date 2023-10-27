import { Table, TableProps } from "@mantine/core";
import { tableDataMapper } from "./tableMapper";

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
        <Table.Thead>
          <Table.Tr className="!text-[#AFAFAF]">
            {columns.map(({ key, title, className }) => (
              <Table.Th key={key} className={className}>
                {title}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data?.map((item, index) => (
            <Table.Tr key={item?.id || index}>
              {columns.map((column) => (
                <Table.Td key={column.key} className={column.className}>
                  {tableDataMapper(column, item, actionMapper(column?.action))}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
};

export default TableComponent;
