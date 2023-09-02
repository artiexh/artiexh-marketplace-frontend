import { CreateUserAddress } from "@/types/User";
import axiosClient from "../axiosClient";

export const logout = async () => {
  try {
    const data = await axiosClient.post("/auth/logout");
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};

export const artistRegister = async (shopName: string) => {
  try {
    const data = await axiosClient.post("/registration/artist", {
      shopName,
    });
    return data;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

export const createUserAddress = async (values: CreateUserAddress) => {
  try {
    const data = await axiosClient.post("/user/address", values);
    return data;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

export const updateUserAddress = async (
  values: Partial<CreateUserAddress>,
  id: string
) => {
  try {
    const data = await axiosClient.put(`/user/address/${id}`, values);
    return data;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};
