import { getPrivateFile } from "@/services/backend/services/media";
import { Modal } from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconDownload,
  IconEye,
  IconFile,
  IconFileCheck,
} from "@tabler/icons-react";

import { Buffer } from "buffer";
import clsx from "clsx";
import useSWR from "swr";

type PrivateFileUploadPreviewProps = {
  classNames?: {
    root: string;
    fileContent: string;
    actions: string;
  };
  allowView?: boolean;
  value?: { id: string; fileName: string; file?: string | File };
};

export default function PrivateFileUploadPreview({
  classNames,
  value,
  allowView = false,
}: PrivateFileUploadPreviewProps) {
  const handleView = (id: string) => {
    modals.open({
      modalId: `image-${value?.id}`,
      title: value?.fileName ?? "",
      children: <PreviewImageBody id={id} />,
    });
  };

  const handleDownload = async (id: string) => {
    const res = await getPrivateFile(id, "blob");
    const href = URL.createObjectURL(res.data);

    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", res.headers["content-type"]); //or any other extension
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };
  return (
    <div
      className={clsx(
        "file-upload-root flex justify-between items-center gap-x-4 w-full",
        classNames?.root
      )}
    >
      <div
        className={clsx(
          "file-upload-content flex-1 w-3/4",
          classNames?.fileContent
        )}
      >
        {value ? (
          <div className="flex gap-x-1 items-center">
            <IconFileCheck className="w-10 aspect-square text-green-800" />
            <span className="text-ellipsis overflow-hidden whitespace-nowrap ">
              {value.fileName}
            </span>
          </div>
        ) : (
          <div className="flex gap-x-1 items-center">
            <IconFile className="text-2xl aspect-square text-gray-600" />
            <span className="text-ellipsis overflow-hidden whitespace-nowrap ">
              No file
            </span>
          </div>
        )}
      </div>
      <div
        className={clsx("file-upload-action flex gap-x-2", classNames?.actions)}
      >
        {allowView && (
          <IconEye
            className="text-xl aspect-square"
            onClick={() => value?.id && handleView(value.id)}
          />
        )}
        <IconDownload
          className="text-xl aspect-square"
          onClick={() => value?.id && handleDownload(value.id)}
        />
      </div>
    </div>
  );
}

function PreviewImageBody({ id }: { id: string }) {
  const { data: res, isLoading } = useSWR(["image", id], () =>
    getPrivateFile(id)
  );

  console.log(res);

  if (isLoading || !res?.data) return null;

  const buffer = Buffer.from(res?.data, "binary").toString("base64");
  const image = `data:${res.headers["content-type"]};base64,${buffer}`;
  return (
    <div className="flex gap-4">
      <div className="image-wrapper">
        <img src={image} />
      </div>
      <div className="right-tab"></div>
    </div>
  );
}
