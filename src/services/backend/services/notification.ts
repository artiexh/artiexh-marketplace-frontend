import { errorHandler } from "@/utils/errorHandler";
import axiosClient from "../axiosClient";

export const readNotification = async (id: string) => {
  try {
    const result = await axiosClient.post(`/notification/${id}
    `);

    return result;
  } catch (err) {
    errorHandler(err);
  }
};
