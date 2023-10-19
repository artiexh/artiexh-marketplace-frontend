import { User } from "@/types/User";
import { Button } from "@mantine/core";
import PostContainer from "../PostContainer/PostContainer";

/* eslint-disable @next/next/no-img-element */
export default function UserProfilePage({ user }: { user: User }) {
  return (
    <div className="user-profile-page relative">
      <div>
        <img
          className="w-full h-[200px] object-cover"
          src={
            "https://i.pinimg.com/originals/ee/26/8c/ee268cf73e3850486966244fe34605d6.png"
          }
          alt="img"
        />
      </div>
      <div className="flex gap-10">
        <div className="relative -top-20 left-10">
          <div className="bg-white w-[300px] rounded-lg">
            <div>
              <div className="pt-12">
                <img
                  src={
                    user.avatarUrl ??
                    "https://cdn.hero.page/pfp/5e92df9f-2fe9-4b7e-a87a-ba503fe458d2-charming-sakura-inspired-avatar-kawaii-anime-avatar-creations-1.png"
                  }
                  className="w-[120px] h-[120px] object-cover rounded-full mx-auto"
                  alt="img"
                />
              </div>
              <div className="px-8 pb-12">
                <div className="mt-6 mb-4 text-center font-bold text-xl">
                  {user.displayName}
                </div>
                <div className="text-gray-500">
                  Im an artist that loves to draw and make lovely stuff! Hire
                  me: cutebunny@gmail.com
                </div>
                <Button className="bg-primary !text-white w-full mt-10">
                  Following
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="ml-8">
          <PostContainer artist={user} />
        </div>
      </div>
    </div>
  );
}
