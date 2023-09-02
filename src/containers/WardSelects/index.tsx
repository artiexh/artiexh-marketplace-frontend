import axiosClient from "@/services/backend/axiosClient";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { District, Province, Ward } from "@/types/User";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { Select } from "@mantine/core";

export default function WardSelects({
  getInputProps,
  ward,
}: {
  getInputProps: any;
  ward?: Ward;
}) {
  const initialValue = ward
    ? {
        wardId: ward.id,
        districtId: ward.district.id,
        provinceId: ward.district.province.id,
      }
    : {
        wardId: "",
        districtId: "",
        provinceId: "",
      };

  const [addressIds, setAddressIds] = useState(initialValue);

  useEffect(() => {
    setAddressIds({
      ...addressIds,
      districtId: "",
      wardId: "",
    });
  }, [addressIds.provinceId]);

  useEffect(() => {
    setAddressIds({
      ...addressIds,
      wardId: "",
    });
  }, [addressIds.districtId]);

  const { data: provinces } = useSWR(["province"], async () => {
    try {
      const { data } = await axiosClient.get<
        CommonResponseBase<PaginationResponseBase<Province>>
      >("/address/country/1/province?pageSize=100");
      return data?.data?.items ?? [];
    } catch (err) {
      return [];
    }
  });

  const { data: districts } = useSWR([addressIds.provinceId], async () => {
    try {
      if (!addressIds.provinceId) return [];

      const { data } = await axiosClient.get<
        CommonResponseBase<PaginationResponseBase<District>>
      >(`/address/province/${addressIds.provinceId}/district?pageSize=100`);
      return data?.data?.items ?? [];
    } catch (err) {
      return [];
    }
  });

  const { data: wards } = useSWR([addressIds.districtId], async () => {
    try {
      if (!addressIds.districtId) return [];

      const { data } = await axiosClient.get<
        CommonResponseBase<PaginationResponseBase<District>>
      >(`/address/district/${addressIds.districtId}/ward?pageSize=100`);
      return data?.data?.items ?? [];
    } catch (err) {
      return [];
    }
  });

  return (
    <div className="ward-selects">
      <Select
        label="Chọn tỉnh thành của bạn"
        placeholder="Chọn tỉnh của bạn"
        searchable
        clearable
        nothingFound="Nothing found"
        data={
          provinces?.map((item) => ({
            value: item.id,
            label: item.fullName,
          })) ?? []
        }
        defaultValue={addressIds.provinceId}
        onChange={(e) =>
          setAddressIds({
            ...addressIds,
            provinceId: e ?? "",
          })
        }
      />
      {addressIds.provinceId && (
        <Select
          className="my-4"
          key={addressIds.provinceId}
          label="Chọn quận huyện của bạn"
          placeholder="Chọn quận huyện của bạn"
          searchable
          clearable
          nothingFound="Nothing found"
          data={
            districts?.map((item) => ({
              value: item.id,
              label: item.fullName,
            })) ?? []
          }
          defaultValue={addressIds.districtId}
          onChange={(e) =>
            setAddressIds({
              ...addressIds,
              districtId: e ?? "",
            })
          }
        />
      )}
      {addressIds.districtId && (
        <Select
          className="my-4"
          key={`${addressIds.districtId}-${addressIds.provinceId}`}
          label="Chọn phường xã của bạn"
          placeholder="Chọn phường xã của bạn"
          searchable
          clearable
          nothingFound="Nothing found"
          data={
            wards?.map((item) => ({
              value: item.id,
              label: item.fullName,
            })) ?? []
          }
          defaultValue={addressIds.wardId}
          onChange={(e) =>
            setAddressIds({
              ...addressIds,
              wardId: e ?? "",
            })
          }
          {...getInputProps("wardId")}
        />
      )}
    </div>
  );
}
