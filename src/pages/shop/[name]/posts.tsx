/* eslint-disable @next/next/no-img-element */
import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import PostContainer from "@/containers/PostContainer/PostContainer";
import ShopTabsContainer from "@/containers/ShopTabsContainer/ShopTabsContainer";
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
  if (user == null) return <h1>Not found</h1>;

  return (
    <div className="user-profile-page relative">
      <div className="hidden md:block">
        <img
          className="w-full h-[200px] object-cover"
          src={
            user.shopThumbnailUrl ??
            "https://i.pinimg.com/originals/ee/26/8c/ee268cf73e3850486966244fe34605d6.png"
          }
          alt="img"
        />
      </div>
      <div className="md:flex gap-10">
        <div className="relative md:-top-20 md:left-10">
          <div className="bg-white w-full md:w-[300px] pb-20 md:pb-0 rounded-lg relative">
            <div>
              <div className="md:hidden absolute w-full">
                <img
                  className="w-full h-[200px] object-cover"
                  src={
                    user.shopThumbnailUrl ??
                    "https://i.pinimg.com/originals/ee/26/8c/ee268cf73e3850486966244fe34605d6.png"
                  }
                  alt="img"
                  height={200}
                  width={200}
                />
              </div>
              <div className="relative top-20 md:top-0">
                <div className="pt-12 relative">
                  <ImageWithFallback
                    src={user.avatarUrl}
                    className="w-[120px] h-[120px] object-cover rounded-full mx-auto"
                    alt="img"
                    width={120}
                    height={120}
                  />
                </div>
                <div className="px-8 pb-12">
                  <div className="mt-6 mb-4 text-center font-bold text-xl">
                    {user.displayName}
                  </div>
                  <div className="text-gray-500">{user.description}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="md:ml-8 flex-1 md:mr-10">
          <div className="mt-5 md:mt-10">
            <ShopTabsContainer />
          </div>
          <PostContainer artist={user} />
        </div>
      </div>
    </div>
  );
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
      revalidate: 10,
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
