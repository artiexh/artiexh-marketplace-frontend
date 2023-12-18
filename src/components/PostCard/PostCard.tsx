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
import moment from "moment";
import { useState } from "react";
import useSWRInfinite from "swr/infinite";
import ImageWithFallback from "../ImageWithFallback/ImageWithFallback";
import "moment/locale/vi";
import { IconMessage } from "@tabler/icons-react";

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
        className="post-card bg-white pt-8 pb-4 rounded-xl shadow w-full cursor-pointer"
        onClick={open}
      >
        <PostCardContent artist={artist} postInformation={postInformation} />
        <div className="mt-3 px-6">
          <div className="flex gap-x-2 items-center">
            <IconMessage />
            <div className="font-semibold">
              {postInformation.numOfComments} bình luận
            </div>
          </div>
        </div>
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
              src={artist.avatarUrl}
              alt="img"
              className="w-[40px] h-[40px] rounded-full"
              width={40}
              height={40}
            />
          </div>
          <div>
            <div className="text-base">{artist.displayName}</div>
            <div className="text-xs text-gray-500">
              {moment(postInformation.createdDate).locale("vi").fromNow()}
            </div>
          </div>
        </div>
        <div className="mt-6">{postInformation.description}</div>
      </div>

      {postInformation.attaches?.[0]?.url && (
        <>
          <Divider className="mt-6" />
          <div className="flex justify-center">
            <div>
              <img
                src={postInformation.attaches?.[0]?.url}
                alt="img"
                className="!h-[400px] object-cover"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

const CommentCard = ({ commentInfo }: { commentInfo: Comment }) => {
  return (
    <div>
      <div className="flex gap-4">
        <div>
          <ImageWithFallback
            src={commentInfo.owner.avatarUrl}
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
          <div className="text-xs text-gray-500 mt-1">
            {moment(commentInfo.createdDate).locale("vi").fromNow()}
          </div>
        </div>
      </div>
    </div>
  );
};
