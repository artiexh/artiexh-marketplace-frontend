export const tableDataMapper = (
  column: any,
  item: any,
  actionHandler?: (record: any) => void
) => {
  if (column?.render) {
    return column.render(item, actionHandler && (() => actionHandler(item)));
  }
  if (column?.dataIndex) {
    return item?.[column?.dataIndex as keyof typeof item];
  }
  return null;
};
