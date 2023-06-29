type TableColumn<T> = {
  title: string;
  key: string;
  className?: string;
  render?: (record: T, actionHandler?: () => void) => React.ReactNode;
};

type TableDataColumn<T> = {
  dataIndex?: string;
} & TableColumn<T>;

type Action = "SEE_DETAIL" | "EDIT";

type TableActionColumn<T> = {
  action: Action;
} & TableColumn<T>;

export type TableColumns<T> = (TableDataColumn<T> | TableActionColumn<T>)[];
