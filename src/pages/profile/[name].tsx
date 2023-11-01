import UserProfilePage from "@/containers/UserProfilePage";
import axiosClient from "@/services/backend/axiosClient";
import { CommonResponseBase } from "@/types/ResponseBase";
import { User } from "@/types/User";
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  user,
}) => {
  if (user != null) return <UserProfilePage user={user} />;

  return <>Not found</>;
};

export default ProfilePage;

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const { params } = context;
  if (params?.name == null) return { props: { user: null } };

  try {
    const { data } = await axiosClient.get<CommonResponseBase<User>>(
      `/artist/${params?.name}`
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
