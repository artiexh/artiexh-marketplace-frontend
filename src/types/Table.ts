export type TableColumns<T> = {
  title: string;
  dataIndex?: string;
  render?: (render: T) => React.ReactNode;
  key: string;
}[];
