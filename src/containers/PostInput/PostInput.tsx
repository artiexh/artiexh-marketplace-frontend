/* eslint-disable @next/next/no-img-element */
import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import { NOTIFICATION_TYPE } from "@/constants/common";
import { publicUploadFile } from "@/services/backend/services/media";
import { $user } from "@/store/user";
import { getNotificationIcon } from "@/utils/mapper";
import { Button, Divider, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useStore } from "@nanostores/react";
import { IconPhoto, IconX } from "@tabler/icons-react";
import { ChangeEvent, MutableRefObject, useRef, useState } from "react";
import defaultImage from "../../../public/assets/default-thumbnail.jpg";
import { createPost } from "@/services/backend/services/post";

export default function PostInput({ refreshFunc }: { refreshFunc?: any }) {
  const user = useStore($user);

  const input = useRef(null) as unknown as MutableRefObject<HTMLInputElement>;

  const [file, setFile] = useState<File>();
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  const uploadHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    setFile(file);
  };

  const submitPost = async () => {
    if (!description) {
      notifications.show({
        message: "Please enter a description!",
        ...getNotificationIcon(NOTIFICATION_TYPE.FAILED),
      });
      return;
    }

    let uploadResult;

    if (file) {
      uploadResult = await publicUploadFile([file]);
    }

    const result = await createPost({
      attaches: uploadResult
        ? [
            {
              description: "",
              title: "",
              type: "OTHER",
              url: uploadResult.data.data.fileResponses[0].presignedUrl,
            },
          ]
        : [],
      description,
    });

    if (result == null) {
      notifications.show({
        message: "Đăng bài thất bại! Xin hãy thử lại!",
        ...getNotificationIcon(NOTIFICATION_TYPE["FAILED"]),
      });
    } else {
      notifications.show({
        message: "Đăng bài thành công!",
        ...getNotificationIcon(NOTIFICATION_TYPE["SUCCESS"]),
      });
      setDescription("");
      setFile(undefined);
      setImageUrl("");
      refreshFunc?.();
    }
  };

  return (
    <div className="post-input bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between gap-6 items-center">
        <div>
          <ImageWithFallback
            fallback="/assets/default-thumbnail.jpg"
            className="rounded-full aspect-square "
            width={60}
            height={60}
            src={
              user?.avatarUrl?.includes("http") ? user.avatarUrl : defaultImage
            }
            alt="image"
          />
        </div>
        <div className="flex-1">
          <TextInput
            placeholder="Bạn đang nghĩ gì...?"
            value={description}
            onChange={(value) => setDescription(value.target.value)}
          />
        </div>
      </div>
      <div className="mt-4 relative">
        {imageUrl && (
          <>
            <img src={imageUrl} width={200} height={200} alt="comment-img" />
            <div className="absolute top-0 right-0">
              <IconX
                className="w-[20px] h-[20px] cursor-pointer"
                onClick={() => {
                  setFile(undefined);
                  setImageUrl("");
                }}
              />
            </div>
          </>
        )}
      </div>
      <Divider className="my-6 text-gray-500" />
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => {
          if (input.current && input.current.click) {
            input.current?.click();
          }
        }}
      >
        <div>
          <IconPhoto />
        </div>
        <div>{file ? "Đổi hình ảnh" : "Thêm hình ảnh"}</div>
      </div>
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(value) => uploadHandler(value)}
      />
      <div>
        <Button
          className="bg-primary !text-white w-full mt-6"
          onClick={submitPost}
        >
          Đăng
        </Button>
      </div>
    </div>
  );
}
