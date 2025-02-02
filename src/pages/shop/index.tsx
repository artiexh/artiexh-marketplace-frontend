import ArtistPreviewCard from "@/components/ArtistPreviewCard/ArtistPreviewCard";
import NotFoundComponent from "@/components/NotFoundComponents/NotFoundComponent";
import { notfoundMessages } from "@/constants/notfoundMesssages";
import axiosClient from "@/services/backend/axiosClient";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { Artist } from "@/types/User";
import { Input, Pagination } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";

export default function ShopListPage() {
  const router = useRouter();
  const params = router.query;

  const [pagination, setPagination] = useState<{
    pageSize: number;
    pageNumber: number;
    name?: string;
  }>({
    pageSize: 12,
    pageNumber: 1,
    name: undefined,
  });

  const { data: artists, isLoading } = useSWR(
    [JSON.stringify(pagination) + JSON.stringify(params)],
    (key) => {
      const { id, ...rest } = params;
      return axiosClient
        .get<CommonResponseBase<PaginationResponseBase<Artist>>>(
          `/marketplace/artist?`,
          {
            params: pagination,
          }
        )
        .then((res) => res.data.data);
    }
  );

  return (
    <div className="shop-list-page">
      <div className="flex justify-between items-center mb-10">
        <div className="font-bold text-2xl">Artist của Arty</div>
        <div>
          <Input
            className="w-[300px]"
            icon={<IconSearch />}
            placeholder="Tìm kiếm artist..."
            onChange={(e) => {
              setPagination({
                ...pagination,
                name: e.target.value,
                pageNumber: 1,
              });
            }}
          />
        </div>
      </div>
      <div className="justify-between items-center hidden lg:flex"></div>

      {artists?.items?.length ? (
        <div className="flex flex-col gap-y-4">
          <div
            className={clsx(
              "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 xl:gap-x-6"
            )}
          >
            {artists?.items?.map((artist, index) => (
              <ArtistPreviewCard artist={artist} key={index} />
            ))}
          </div>
          <div className="flex justify-center mt-6 mb-20">
            <Pagination
              value={pagination.pageNumber}
              onChange={(e) => {
                setPagination((prev) => ({ ...prev, pageNumber: e }));
              }}
              total={artists?.totalPage ?? 0}
              classNames={{
                control: "[&[data-active]]:!text-white",
              }}
            />
          </div>
        </div>
      ) : (
        <NotFoundComponent title={notfoundMessages.NOT_FOUND_ARTIST} />
      )}
    </div>
  );
}
