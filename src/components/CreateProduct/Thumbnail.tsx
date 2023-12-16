import { Button } from "@mantine/core";
import clsx from "clsx";
import Image from "next/image";
import { ChangeEvent, FC, HTMLAttributes, useState } from "react";

type ThumbnailProps = HTMLAttributes<HTMLDivElement> & {
  setFile?: (file: File) => void;
  setDataUrl?: (dataUrl: string) => void;
  setCustomFile?: ({ file, url }: { file: File; url: string }) => void;
  error?: string;
  url?: string;
  addNode?: boolean;
  defaultPlaceholder?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  disabled?: boolean;
};

const Thumbnail: FC<ThumbnailProps> = ({
  url,
  addNode = false,
  className,
  setCustomFile,
  setFile,
  setDataUrl,
  error,
  defaultPlaceholder = <div>+</div>,
  clearable = false,
  onClear,
  disabled = false,
  ...rest
}) => {
  const [imageUrl, setImageUrl] = useState(url);

  const uploadHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (!addNode) setImageUrl(reader.result as string);
      setDataUrl && setDataUrl(reader.result as string);
      setCustomFile && setCustomFile({ file, url: reader.result as string });
    };
    reader.readAsDataURL(file);
    setFile && setFile(file);
  };

  return (
    <div
      className={clsx(
        "border-[1px] border-gray-primary w-full md:w-full aspect-square rounded-lg flex-1 mx-auto flex items-center justify-center relative overflow-hidden",
        error && "border-red-500",
        className
      )}
      {...rest}
    >
      {imageUrl ? (
        <>
          {/* We don't need optimization */}
          {/* eslint-disable-next-line */}
          <img
            className="object-contain aspect-square object-center"
            src={imageUrl}
            alt="thumbnail"
          />
        </>
      ) : (
        defaultPlaceholder
      )}
      <input
        type="file"
        name="thumbnail"
        className={clsx(
          "absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer peer",
          disabled && "pointer-events-none"
        )}
        onChange={uploadHandler}
        accept="image/*"
        value=""
        readOnly={disabled}
      />
      {!disabled && imageUrl && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none peer-hover:opacity-100 hover:opacity-100 opacity-0 bg-black/50 transition-opacity flex flex-col items-center justify-center gap-1">
          <div className="text-white text-center">Chỉnh sửa</div>
          {clearable && (
            <Button
              size="xs"
              type="button"
              className="bg-red-500 pointer-events-auto"
              color="red"
              onClick={() => {
                setImageUrl("");
                onClear && onClear();
              }}
            >
              Xóa
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Thumbnail;
