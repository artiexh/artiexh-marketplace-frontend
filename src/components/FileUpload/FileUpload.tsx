import {
  ActionIcon,
  Button,
  FileButton,
  FileButtonProps,
  Menu,
} from "@mantine/core";
import { IconDotsVertical, IconFile, IconFileCheck } from "@tabler/icons-react";
import clsx from "clsx";
import { MouseEventHandler } from "react";

type FileUploadProps = {
  value?: { fileName: string; file: string | File };
  onChange?: FileButtonProps["onChange"];
  accept?: string;
  classNames?: {
    root: string;
    fileContent: string;
    actions: string;
  };
  fileActions?: {
    reupload?: MouseEventHandler<HTMLButtonElement>;
    remove?: MouseEventHandler<HTMLButtonElement>;
  };
  disabled?: boolean;
};

export default function FileUpload({
  classNames,
  value,
  onChange = () => {},
  accept,
  fileActions,
  disabled = false,
}: FileUploadProps) {
  return (
    <div
      className={clsx(
        "file-upload-root flex justify-between items-center gap-x-4 w-full",
        classNames?.root
      )}
    >
      <div
        className={clsx(
          "file-upload-content flex-1",
          classNames?.fileContent,
          value && "w-3/4"
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
            <IconFile className="aspect-square text-gray-600" />
            <span className="text-ellipsis overflow-hidden whitespace-nowrap ">
              No file
            </span>
          </div>
        )}
      </div>
      <div className={clsx("file-upload-action", classNames?.actions)}>
        {disabled ? null : !value ? (
          <FileButton onChange={onChange} accept={accept}>
            {(props) => (
              <Button {...props} className="rounded-full">
                Upload
              </Button>
            )}
          </FileButton>
        ) : (
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon>
                <IconDotsVertical className="w-8 aspect-square" />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>File actions</Menu.Label>
              <Menu.Item onClick={fileActions?.reupload}>Reupload</Menu.Item>
              <Menu.Item onClick={fileActions?.remove}>Remove</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </div>
    </div>
  );
}
