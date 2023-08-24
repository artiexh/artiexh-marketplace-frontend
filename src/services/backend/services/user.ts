import axiosClient from "../axiosClient";

export const logout = async () => {
  try {
    const data = await axiosClient.post("/auth/logout");
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};
