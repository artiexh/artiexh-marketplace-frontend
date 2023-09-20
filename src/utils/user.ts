import axiosClient from "@/services/backend/axiosClient";
import { setUser, setShop } from "@/store/user";
import { CommonResponseBase } from "@/types/ResponseBase";
import { Shop } from "@/types/Shop";
import { User } from "@/types/User";

export const updateUserInformation = async () => {
  try {
    const { data } = await axiosClient.get<CommonResponseBase<User>>(
      "https://api.artiexh.com/api/v1/account/me"
    );

    setUser(data.data);

    const { data: shopData } = await axiosClient.get<CommonResponseBase<Shop>>(
      "/shop",
      {
        params: {
          ownerId: data.data.id,
        },
      }
    );

    setShop(shopData.data);
  } catch (err) {
    console.log(err);
  }
};
