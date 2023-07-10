import TableContainer from "@/containers/TableContainer";
import { Button, Input } from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useState } from "react";
import artistProductColumns from "./artistProductColumns";

const ArtistProductTable = () => {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<Record<string, string>>({});

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Input
          icon={<IconSearch />}
          onChange={(e) =>
            setSearchParams((prev) => ({ ...prev, _like: e.target.value }))
          }
        />
        <Button
          leftIcon={<IconPlus />}
          type="button"
          onClick={() => router.push("/artist/create")}
          variant="outline"
        >
          Create product
        </Button>
      </div>
      <TableContainer
        pathName="products"
        columns={artistProductColumns}
        pagination
        tableProps={{ verticalSpacing: "sm", className: "font-semibold" }}
        pageSize={6}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        className="mt-2.5"
        header={(response) => (
          <>
            <div className="text-3xl font-bold">Products</div>
            <div className="text-[#AFAFAF] mt-1">
              {/* TODO: Replace with API call later or filter based on response */}
              {response?.data.length} products need to be updated their status
            </div>
          </>
        )}
      />
    </div>
  );
};

export default ArtistProductTable;
