import { CommonResponseBase } from "@/types/ResponseBase";
import axiosClient from "../uploadAxiosClient";

export const publicUploadFile = async (files: File[]) => {
  try {
    const data = await axiosClient.post<
      CommonResponseBase<{
        fileResponses: {
          presignedUrl: string;
          fileName: string;
        }[];
      }>
    >("/media/public-upload", {
      file: files,
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const privateUploadFiles = async (files: File[]) =>
  axiosClient.post<
    CommonResponseBase<{
      fileResponses: {
        id: string;
        presignedUrl: string;
        fileName: string;
      }[];
    }>
  >("/media/upload", {
    file: files,
  });
