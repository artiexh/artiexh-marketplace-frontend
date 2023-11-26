/* eslint-disable @next/next/no-img-element */
import PostCommentInput from "@/containers/PostCommentInput/PostCommentInput";
import axiosClient from "@/services/backend/axiosClient";
import { Comment, PostInformation } from "@/types/Post";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { User } from "@/types/User";
import { Divider, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconHeart, IconMessageCircle } from "@tabler/icons-react";
import { useState } from "react";
import useSWRInfinite from "swr/infinite";
import ImageWithFallback from "../ImageWithFallback/ImageWithFallback";

type PostCardProps = {
  artist: User;
  postInformation: PostInformation;
};

export default function PostCard({ artist, postInformation }: PostCardProps) {
  function getKey(pageNumber: number, previousPageData: PostInformation[]) {
    if (pageNumber && !previousPageData.length) return null; // reached the end
    return `/post/${postInformation.id}/comment?pageNumber=${
      pageNumber + 1
    }&pageSize=4&sortBy=id&sortDirection=DESC`; // SWR key
  }

  const [opened, { open, close }] = useDisclosure(false);
  const [totalPage, setTotalPage] = useState<number>(
    Math.ceil(postInformation.numOfComments / 4)
  );
  const {
    data: comments,
    size,
    setSize,
    mutate,
  } = useSWRInfinite(getKey, (url: string) => {
    return axiosClient
      .get<CommonResponseBase<PaginationResponseBase<Comment>>>(url)
      .then((res) => {
        setTotalPage(res.data.data.totalPage);
        return res.data.data.items;
      });
  });

  console.log(comments);

  return (
    <>
      <Modal size="70vw" opened={opened} onClose={close}>
        <PostCardContent artist={artist} postInformation={postInformation} />
        <Divider className="my-4" />
        <div className="mx-4">
          <PostCommentInput commentId={postInformation.id} refetch={mutate} />
          <div className="mt-6">
            {comments?.flat()?.map((item) => (
              <div key={item?.id} className="my-4">
                <CommentCard commentInfo={item} />
              </div>
            ))}
            {totalPage > size && (
              <div
                className="cursor-pointer text-gray-600 text-semibold text-sm mt-6"
                onClick={() => setSize((size) => size + 1)}
              >
                Xem Thêm{" "}
              </div>
            )}
          </div>
        </div>
      </Modal>
      <div
        className="post-card bg-white py-8 rounded-xl shadow w-full cursor-pointer"
        onClick={open}
      >
        <PostCardContent artist={artist} postInformation={postInformation} />
      </div>
    </>
  );
}

const PostCardContent = ({ artist, postInformation }: PostCardProps) => {
  return (
    <>
      <div className="px-6">
        <div className="flex gap-4">
          <div>
            <ImageWithFallback
              src={
                artist.avatarUrl ??
                "https://cdn.hero.page/pfp/5e92df9f-2fe9-4b7e-a87a-ba503fe458d2-charming-sakura-inspired-avatar-kawaii-anime-avatar-creations-1.png"
              }
              alt="img"
              className="w-[40px] h-[40px] rounded-full"
              width={40}
              height={40}
            />
          </div>
          <div>
            <div className="text-sm">{artist.displayName}</div>
            <div className="text-sm text-gray-500">1 day ago</div>
          </div>
        </div>
        <div className="mt-6">{postInformation.description}</div>
      </div>
      <Divider className="mt-6" />
      {postInformation.attaches?.[0]?.url && (
        <div>
          <ImageWithFallback
            src={postInformation.attaches?.[0]?.url}
            alt="img"
            className="w-full !h-[400px] object-cover"
            fill
          />
        </div>
      )}
      <div className="mx-6 flex gap-4 mt-6">
        <div className="flex gap-2 items-center">
          <div>
            <IconHeart />
          </div>
          <div>{postInformation.likes}</div>
        </div>
      </div>
    </>
  );
};

const CommentCard = ({ commentInfo }: { commentInfo: Comment }) => {
  return (
    <div>
      <div className="flex gap-4">
        <div>
          <ImageWithFallback
            src={
              commentInfo.owner.avatarUrl ??
              "https://cdn.hero.page/pfp/5e92df9f-2fe9-4b7e-a87a-ba503fe458d2-charming-sakura-inspired-avatar-kawaii-anime-avatar-creations-1.png"
            }
            alt="img"
            className="w-[40px] h-[40px] rounded-full"
            width={40}
            height={40}
          />
        </div>
        <div className="flex-1">
          <div className="bg-gray-100 p-2 rounded-lg">
            <div className="text-sm font-bold">
              {commentInfo.owner.displayName}
            </div>
            <div className="text-sm">{commentInfo.content}</div>
          </div>
          <div className="text-xs text-gray-500 mt-1">1 day ago</div>
        </div>
      </div>
    </div>
  );
};
