import { PostBody } from "@/types/Post";
import axiosClient from "../axiosClient";

export default async function createPost(values: PostBody) {
  try {
    const result = await axiosClient.post("/post", values);

    return result;
  } catch (err) {
    console.log(err);
  }
}
