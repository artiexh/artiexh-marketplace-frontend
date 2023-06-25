import { ArtistProductColumnType } from "@/types/Product";
import { TableColumns } from "@/types/Table";

const artistProductColumns: TableColumns<ArtistProductColumnType> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Release Date",
    dataIndex: "publishDatetime",
    key: "publishDatetime",
  },
  {
    title: "Number of orders",
    dataIndex: "maxItemsPerOrder",
    key: "maxItemsPerOrder",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
];

export default artistProductColumns;
