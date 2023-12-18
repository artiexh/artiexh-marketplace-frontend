import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import { ArtistProductColumnType } from "@/types/Product";
import { TableColumns } from "@/types/Table";
import { currencyFormatter } from "@/utils/formatter";
import { ActionIcon } from "@mantine/core";
import { IconBallpen, IconEye } from "@tabler/icons-react";

const shopProductColumns: TableColumns<
  ArtistProductColumnType & {
    onView?: () => void;
  }
> = [
  {
    title: "Mã sản phẩm",
    key: "productCode",
    dataIndex: "productCode",
  },
  {
    title: "Tên sản phẩm",
    key: "name",
    render: (record) => (
      <div className="flex items-center gap-5">
        <div className="relative w-16 aspect-square">
          <ImageWithFallback
            fallback="/assets/default-thumbnail.jpg"
            src={record.thumbnailUrl}
            alt="product-thumb"
            className="object-cover rounded-full aspect-square"
          />
        </div>
        <div>{record.name}</div>
      </div>
    ),
  },
  {
    title: "Giá bán",
    key: "price",
    render: (value) => (
      <div>
        {value?.price?.amount ? currencyFormatter(value.price.amount) : "N/A"}
      </div>
    ),
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
    key: "quantity",
    className: "!text-center w-[10rem]",
  },
  {
    title: "Tác vụ",
    key: "action",
    action: "EDIT",
    className: "!text-center",
    render: (record) => (
      <div className="flex justify-center w-[100px]">
        <ActionIcon onClick={() => record.onView && record.onView()}>
          <IconEye />
        </ActionIcon>
      </div>
    ),
  },
];

export default shopProductColumns;
