import { DesignItem } from "@/utils/localStorage/designProduct";

type DesignItemCardProps = {
  data: DesignItem;
  actions?: React.ReactNode;
};

export default function DesignItemCard({ data, actions }: DesignItemCardProps) {
  return (
    <div className="w-full bg-white rounded-md p-2 flex gap-x-4">
      <div className="image-wrapper w-36 aspect-square">
        <img src={data.thumbnail} className="object-cover" />
      </div>
      <div className="flex-1 flex flex-col gap-y-2">
        {data.collection && <span>Collection {data.collection.name}</span>}
        <span>{data.product.name}</span>
        <span>{data.status}</span>
        {actions}
      </div>
    </div>
  );
}
