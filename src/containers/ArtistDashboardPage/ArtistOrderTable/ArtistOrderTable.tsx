import TableContainer from "@/containers/TableContainer";
import artistOrderColumns from "./artistOrderColumns";
import { useState } from "react";

const ArtistOrderTable = () => {
  const [searchParams, setSearchParams] = useState<Record<string, string>>({});

  return (
    <TableContainer
      pathName="orders"
      columns={artistOrderColumns}
      pagination
      tableProps={{ verticalSpacing: "sm", className: "font-semibold" }}
      pageSize={6}
      searchParams={searchParams}
      setSearchParams={setSearchParams}
      className="mt-2.5"
      header={(response) => (
        <>
          <div className="text-3xl font-bold">Orders</div>
          <div className="text-[#AFAFAF] mt-1">
            {/* TODO: Replace with API call later or filter based on response */}
            {response?.data.length} products need to be updated their status
          </div>
        </>
      )}
    />
  );
};

export default ArtistOrderTable;
