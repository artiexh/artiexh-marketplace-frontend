import { ArtistRegisterData, CreateUserAddress } from "@/types/User";
import axiosClient from "../axiosClient";
import { setShop, setStatus, setUser } from "@/store/user";
import { CommonResponseBase } from "@/types/ResponseBase";

export const logout = async () => {
  try {
    const data = await axiosClient.post("/auth/logout");
    setUser(undefined);
    setShop(undefined);
    setStatus("INIT");

    return data;
  } catch (err) {
    console.log(err);
  }
};

export const artistRegister = async (shopName: ArtistRegisterData) => {
  const data = await axiosClient.post("/registration/artist", shopName);
  return data;
};

export const createUserAddress = async (values: CreateUserAddress) => {
  const data = await axiosClient.post("/user/address", values);
  return data;
};

export const updateUserAddress = async (
  values: Partial<CreateUserAddress>,
  id: string
) => {
  const data = await axiosClient.put(`/user/address/${id}`, values);
  return data;
};

export const updateUserProfileApi = async (body: {
  avatarUrl?: string;
  displayName: string;
  email?: string;
}) =>
  axiosClient.put<
    CommonResponseBase<{
      avatarUrl: string;
      displayName: string;
      email: string;
      id: string;
      numOfSubscriptions: number;
      role: string;
      status: string;
      username: string;
    }>
  >(`/account/profile`, body);

export const updateShopProfileApi = async (body: {
  bankAccount?: string;
  bankAccountName?: string;
  bankName?: string;
  phone?: string;
  shopThumbnailUrl?: string;
  description?: string;
}) =>
  axiosClient.put<
    CommonResponseBase<{
      address: string;
      bankAccount: string;
      bankName: string;
      phone: string;
      shopThumbnailUrl: string;
      wardId: string;
    }>
  >(`/artist/profile`, body);
