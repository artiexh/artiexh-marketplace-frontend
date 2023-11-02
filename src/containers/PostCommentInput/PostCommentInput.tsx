import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import { comment } from "@/services/backend/services/post";
import { $user } from "@/store/user";
import { TextInput } from "@mantine/core";
import { useStore } from "@nanostores/react";
import { useState } from "react";
import defaultImage from "../../../public/assets/default-thumbnail.jpg";
import { IconSend } from "@tabler/icons-react";
import { KeyedMutator } from "swr";
import { NOTIFICATION_TYPE } from "@/constants/common";
import { getNotificationIcon } from "@/utils/mapper";
import { notifications } from "@mantine/notifications";

export default function PostCommentInput({
  commentId,
  refetch,
}: {
  commentId: string;
  refetch: any;
}) {
  const [content, setContent] = useState("");
  const user = useStore($user);

  const submitComment = async () => {
    const result = await comment(commentId, content);

    if (result?.data.data) {
      refetch?.();
      setContent("");
    } else {
      notifications.show({
        message: "Đăng bài thất bại! Xin hãy thử lại!",
        ...getNotificationIcon(NOTIFICATION_TYPE["FAILED"]),
      });
    }
  };

  return (
    <div className="flex gap-6 items-center">
      <div className="flex justify-between gap-6 items-center flex-1">
        <div>
          <ImageWithFallback
            fallback="/assets/default-thumbnail.jpg"
            className="rounded-full aspect-square "
            width={40}
            height={40}
            src={
              user?.avatarUrl?.includes("http") ? user.avatarUrl : defaultImage
            }
            alt="image"
          />
        </div>
        <div className="flex-1">
          <TextInput
            placeholder="Viết câu trả lời..."
            value={content}
            onChange={(value) => setContent(value.target.value)}
          />
        </div>
      </div>
      <div className="cursor-pointer" onClick={submitComment}>
        <IconSend />
      </div>
    </div>
  );
}
