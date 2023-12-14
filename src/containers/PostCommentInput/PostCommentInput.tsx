import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import { NOTIFICATION_TYPE } from "@/constants/common";
import { comment } from "@/services/backend/services/post";
import { $user } from "@/store/user";
import { getNotificationIcon } from "@/utils/mapper";
import { TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useStore } from "@nanostores/react";
import { IconSend } from "@tabler/icons-react";
import { useState } from "react";
import defaultImage from "../../../public/assets/default-thumbnail.jpg";
import Link from "next/link";

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

  if (!user)
    return (
      <div>
        Bạn muốn bình luận?{" "}
        <Link className="text-primary font-semibold" href="/auth/signin">
          Đăng nhập ngay!
        </Link>
      </div>
    );

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
              user?.avatarUrl?.includes("http")
                ? user.avatarUrl
                : defaultImage.src
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
