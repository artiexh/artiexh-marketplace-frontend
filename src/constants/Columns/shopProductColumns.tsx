import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import { ArtistProductColumnType } from "@/types/Product";
import { TableColumns } from "@/types/Table";
import { currencyFormatter } from "@/utils/formatter";
import { IconBallpen } from "@tabler/icons-react";

const shopProductColumns: TableColumns<ArtistProductColumnType> = [
  {
    title: "Product code",
    key: "productCode",
    dataIndex: "productCode",
  },
  {
    title: "Name",
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
    title: "Price",
    key: "price",
    render: (value) => (
      <div>
        {value?.price?.amount ? currencyFormatter(value.price.amount) : "N/A"}
      </div>
    ),
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
    className: "!text-center w-[10rem]",
  },
  {
    title: "Sold quantity",
    dataIndex: "soldQuantity",
    key: "soldQuantity",
    className: "!text-center w-[10rem]",
  },
  {
    title: "Action",
    key: "action",
    action: "EDIT",
    className: "!text-center",
    render: (_, actionHandler) => (
      <div className="flex justify-center">
        <IconBallpen
          className="cursor-pointer"
          onClick={() => actionHandler && actionHandler()}
        />
      </div>
    ),
  },
];

export default shopProductColumns;
