import NotFoundComponent from "@/components/NotFoundComponents/NotFoundComponent";
import MyProfilePage from "@/containers/MyProfilePage";
import AuthWrapper from "@/services/guards/AuthWrapper";
import { $user } from "@/store/user";
import { useStore } from "@nanostores/react";
import { useRouter } from "next/router";

const ProfilePage = () => {
  const $storedUser = useStore($user);

  if ($storedUser != null) {
    return <MyProfilePage user={$storedUser} />;
  }

  return <NotFoundComponent />;
};

ProfilePage.getLayout = function getLayout(page: any) {
  return <Wrapper>{page}</Wrapper>;
};

function Wrapper({ children }: { children: any }) {
  const router = useRouter();
  return <AuthWrapper router={router}>{children}</AuthWrapper>;
}

export default ProfilePage;
