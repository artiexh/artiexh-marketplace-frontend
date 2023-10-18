import { $authStatus, $user } from "@/store/user";
import { useStore } from "@nanostores/react";
import { useRouter } from "next/navigation";
import { NextRouter } from "next/router";

type AuthWrapperProps = {
  children: React.ReactNode;
  router: NextRouter | ReturnType<typeof useRouter>;
};

export default function AuthWrapper({ children, router }: AuthWrapperProps) {
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

  return <>{children}</>;
}
