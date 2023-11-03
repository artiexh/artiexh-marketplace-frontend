import { PostBody } from "@/types/Post";
import axiosClient from "../axiosClient";
import { CommonResponseBase } from "@/types/ResponseBase";

export const createPost = async (values: PostBody) => {
  try {
    const result = await axiosClient.post("/post", values);

    return result;
  } catch (err) {
    console.log(err);
  }
};

export const comment = async (commentId: string, value: string) => {
  try {
    const result = await axiosClient.post<CommonResponseBase<Comment>>(
      `/post/${commentId}/comment`,
      {
        content: value,
      }
    );

    return result;
  } catch (err) {
    console.log(err);
  }
};
