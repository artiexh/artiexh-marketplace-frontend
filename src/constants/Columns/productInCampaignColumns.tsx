import PrivateImageLoader from "@/components/PrivateImageLoader/PrivateImageLoader";
import { CampaignDetail } from "@/types/Campaign";
import { TableColumns } from "@/types/Table";
import { currencyFormatter } from "@/utils/formatter";
import { Tooltip } from "@mantine/core";
import { IconBallpen, IconEye } from "@tabler/icons-react";
import clsx from "clsx";

const productInCampaignColumns: TableColumns<
  CampaignDetail["products"][0] & { onEdit?: Function; onView?: Function }
> = [
  {
    title: "Tên",
    key: "name",
    render: (record) => (
      <div className="flex items-center gap-5">
        <div className="relative w-16 aspect-square">
          <PrivateImageLoader
            className="rounded-md object-fill w-full h-full"
            id={record.customProduct.modelThumbnail?.id.toString()}
            alt="test"
          />
        </div>
        <div>
          <div>{record.customProduct.name}</div>
          <div className="text-sm text-gray-500">
            Template: {record.customProduct.variant.productTemplate.name}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Giá sản xuất",
    key: "manufacturingPrice",
    render: (record) =>
      record?.providerConfig?.basePriceAmount ? (
        <span>
          {currencyFormatter(record?.providerConfig?.basePriceAmount)}
        </span>
      ) : (
        <span>Không khả dụng</span>
      ),
  },
  {
    title: "Giá bán",
    key: "salePrice",
    render: (record) =>
      record?.price ? (
        <span>{currencyFormatter(Number(record.price.amount))}</span>
      ) : (
        <span>Không khả dụng</span>
      ),
  },
  {
    title: "Số lượng",
    key: "quantity",
    render: (record) =>
      record?.quantity ? (
        <span>{record.quantity}</span>
      ) : (
        <span>Không khả dụng</span>
      ),
  },

  {
    title: "Tác vụ",
    key: "action",
    className: "!text-center",
    render: (record) => (
      <div className="flex justify-center gap-x-2 w-full">
        <Tooltip label="Chỉnh sửa">
          <IconBallpen
            className={clsx(
              record.onEdit ? "cursor-pointer" : "cursor-not-allowed"
            )}
            onClick={() => record.onEdit && record.onEdit()}
          />
        </Tooltip>
        <Tooltip label="Xem">
          <IconEye
            className="cursor-pointer"
            onClick={() => record.onView && record.onView()}
          />
        </Tooltip>
      </div>
    ),
  },
];

export default productInCampaignColumns;
