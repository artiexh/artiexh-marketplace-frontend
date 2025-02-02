import { CommonResponseBase } from "@/types/ResponseBase";
import axiosClient from "../uploadAxiosClient";
import { ResponseType } from "axios";

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

export const privateUploadFiles = (files: File[]) =>
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

export const getPrivateFile = (id: string, responseType?: ResponseType) =>
  axiosClient.get(`/media/download/${id}`, {
    responseType: responseType ?? "arraybuffer",
  });
