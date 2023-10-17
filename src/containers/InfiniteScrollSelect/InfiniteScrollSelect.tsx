import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Select } from "@mantine/core";
import { useMemo, useState } from "react";

export function InfiniteScrollSelect<T>({
  mode,
  endpoint,
  valueKey,
  labelKey,
  onChange,
  value,
}: {
  mode?: "multiple" | "tags" | undefined;
  endpoint: string;
  valueKey: keyof T;
  labelKey: keyof T;
  onChange?: any;
  value?: any;
}) {
  const [searchKey, setSearchKey] = useState<string>();

  const { data, onScroll, loading } = useInfiniteScroll<T>({
    endpoint,
    searchKeyName: labelKey,
    searchKey,
  });

  console.log(data);

  const options = useMemo(
    () =>
      data?.flat()?.map?.((item) => ({
        value: item?.[valueKey] as string,
        label: item?.[labelKey] as string,
      })),
    [data, labelKey, valueKey]
  );

  const handleSearch = (newValue: string) => {
    setSearchKey(newValue);
  };

  const mapValueToOValueObject = (value: any) => {
    if (mode === "multiple") {
      onChange(
        value.map((item: any) => ({
          value: item,
          label: options?.find((option) => option.value === item)?.label,
        }))
      );
    } else {
      onChange({
        value,
        label: options?.find((item) => item.value === value)?.label,
      });
    }
  };

  return (
    <Select
      onScroll={onScroll}
      searchable
      onSearchChange={handleSearch}
      onChange={(value) => mapValueToOValueObject(value)}
      data={options ?? []}
      filter={() => {}}
    />
  );
}

export default InfiniteScrollSelect;
