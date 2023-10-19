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
import { useRouter } from "next/router";
import AuthWrapper from "@/services/guards/AuthWrapper";

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> & {
  getLayout: Function;
} = ({ user }) => {
  const $storedUser = useStore($user);

  if (user != null) return <UserProfilePage user={user} />;

  if ($storedUser != null) {
    return <MyProfilePage user={$storedUser} />;
  }

  return <>Not found</>;
};

ProfilePage.getLayout = function getLayout(page: any) {
  return <Wrapper>{page}</Wrapper>;
};

function Wrapper({ children }: { children: any }) {
  const router = useRouter();
  return <AuthWrapper router={router}>{children}</AuthWrapper>;
}

export default ProfilePage;

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const { params } = context;
  if (params?.id == null || params?.id === "me")
    return { props: { user: null } };

  try {
    const { data } = await axiosClient.get<CommonResponseBase<User>>(
      `/account/${params?.id}/profile`
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
