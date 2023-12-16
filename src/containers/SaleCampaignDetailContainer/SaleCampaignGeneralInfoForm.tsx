import { SaleCampaignDetail } from "@/types/SaleCampaign";
import { SegmentedControl, TextInput, Textarea } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useParams } from "next/navigation";

export default function SaleCampaignGeneralInfoForm({
  data,
  disabled = false,
}: {
  data: Pick<
    SaleCampaignDetail,
    "name" | "description" | "type" | "from" | "to" | "publicDate"
  >;
  disabled?: boolean;
}) {
  const params = useParams();

  const id = params!.id as string;

  return (
    <div className="card general-wrapper mt-2 ">
      <div className="flex gap-x-4">
        <div className="flex flex-col space-y-4 flex-[3]">
          <div className="flex w-full justify-between items-center">
            <h2 className="text-3xl font-bold">Thông tin cơ bản</h2>
          </div>
          <div className="flex items-end gap-x-2">
            <TextInput
              label="Tên"
              readOnly
              value={data.name}
              className="flex-[3]"
            />
          </div>
          <div className="flex items-end gap-x-2">
            <DateTimePicker
              label="Mở bán từ"
              classNames={{
                input: "!py-0",
              }}
              disabled
              value={data.from ? new Date(data.from) : undefined}
              className="h-fit flex-1"
            />
            <DateTimePicker
              label="Kết thúc sau"
              classNames={{
                input: "!py-0",
              }}
              disabled
              value={data.to ? new Date(data.to) : undefined}
              className="h-fit flex-1"
            />
          </div>
          <div className="flex items-end gap-x-2">
            <DateTimePicker
              label="Ngày hiển thị"
              classNames={{
                input: "!py-0",
              }}
              disabled
              value={data.publicDate ? new Date(data.publicDate) : undefined}
              className="h-fit flex-1"
            />
            <SegmentedControl
              readOnly
              value={data.type}
              className="h-fit flex-1"
              data={[
                { label: "Riêng tư", value: "PRIVATE" },
                { label: "Cộng tác", value: "SHARE" },
                { label: "Công khai", value: "PUBLIC" },
              ]}
            />
          </div>
          <Textarea label="Mô tả" readOnly value={data.description} />
        </div>
      </div>
    </div>
  );
}
