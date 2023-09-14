import axiosClient from "@/services/backend/axiosClient";
import { CommonResponseBase } from "@/types/ResponseBase";
import { User } from "@/types/User";
import {
  GetStaticPropsContext,
  GetStaticPaths,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import { useStore } from "@nanostores/react";
import { $user } from "@/store/user";
import MyProfilePage from "@/containers/MyProfilePage";
import UserProfilePage from "@/containers/UserProfilePage";

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  user,
}) => {
  const $storedUser = useStore($user);

  if (user == null && $storedUser != null) {
    return <MyProfilePage user={$storedUser} />;
  }

  return <UserProfilePage />;
};

export default ProfilePage;

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const { params } = context;
  if (params?.id || params?.id === "me") return { props: { user: null } };

  try {
    const { data } = await axiosClient.get<CommonResponseBase<User>>(
      `/account/public/${params?.id}/profile`
    );

    return {
      props: {
        user: data.data,
      },
    };
  } catch (err) {
    return { props: { user: null } };
  }
};

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};
