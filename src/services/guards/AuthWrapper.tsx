import { $authStatus, $user } from "@/store/user";
import { useStore } from "@nanostores/react";
import { useRouter } from "next/navigation";
import { NextRouter } from "next/router";
import { logout } from "../backend/services/user";

type AuthWrapperProps = {
  children: any;
  router: NextRouter | ReturnType<typeof useRouter>;
  roles?: ("USER" | "ARTIST")[];
};

export default function AuthWrapper({
  children,
  router,
  roles,
}: AuthWrapperProps) {
  const status = useStore($authStatus);

  const user = useStore($user);

  if (status === "INIT" || status === "FETCHING") return null;

  if (status === "FETCHED" && !user) {
    router.push(
      `/auth/signin?${new URLSearchParams({
        redirect_uri: window.location.pathname,
      }).toString()}`
    );
    return null;
  }

  if (user?.role === "ADMIN" || user?.role === "STAFF") {
    logout().then(() => {
      router.push(
        `/auth/signin?${new URLSearchParams({
          redirect_uri: window.location.pathname,
        }).toString()}`
      );
    });

    return null;
  }

  if (
    status === "FETCHED" &&
    roles &&
    user?.role &&
    !roles.includes(user?.role as any)
  ) {
    router.push(`/error/${403}`);
    return null;
  }

  return <>{children}</>;
}
