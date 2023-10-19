/* eslint-disable @next/next/no-img-element */
import { PostInformation } from "@/types/Post";
import { User } from "@/types/User";
import { Attaches } from "@/types/common";
import { Divider } from "@mantine/core";
import { IconHeart, IconMessageCircle } from "@tabler/icons-react";

type PostCardProps = {
  artist: User;
  postInformation: PostInformation;
};

export default function PostCard({ artist, postInformation }: PostCardProps) {
  return (
    <div className="post-card bg-white py-8 rounded-xl shadow">
      <div className="px-6">
        <div className="flex gap-4">
          <div>
            <img
              src={
                artist.avatarUrl ??
                "https://cdn.hero.page/pfp/5e92df9f-2fe9-4b7e-a87a-ba503fe458d2-charming-sakura-inspired-avatar-kawaii-anime-avatar-creations-1.png"
              }
              alt="img"
              className="w-[40px] h-[40px] rounded-full"
            />
          </div>
          <div>
            <div className="text-sm">{artist.displayName}</div>
            <div className="text-sm text-gray-500">1 day ago</div>
          </div>
        </div>
        <div className="mt-6">{postInformation.content}</div>
      </div>
      <Divider className="mt-6" />
      <div>
        <img
          src={postInformation.attachment}
          alt="img"
          className="w-full !h-[400px] object-cover"
        />
      </div>
      <div className="mx-6 flex gap-4 mt-6">
        <div className="flex gap-2 items-center">
          <div>
            <IconMessageCircle />
          </div>
          <div>{postInformation.totalLike}</div>
        </div>
        <div className="flex gap-2 items-center">
          <div>
            <IconHeart />
          </div>
          <div>{postInformation.comments.length}</div>
        </div>
      </div>
    </div>
  );
}
