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
