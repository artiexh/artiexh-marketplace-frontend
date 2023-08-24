import { useEffect } from "react";
import axiosClient from "../backend/axiosClient";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { AUTH_ROUTE, NOT_REQUIRE_AUTH_ROUTE, ROUTE } from "@/constants/route";
import { usePathname } from "next/navigation";
import { $user } from "@/store/user";
import { User } from "@/types/User";
import { CommonResponseBase } from "@/types/ResponseBase";

const AuthGuard = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = Object.values(AUTH_ROUTE).includes(pathname);

  useEffect(() => {
    let mounted = true;
    const validate = async () => {
      try {
        const { data } = await axiosClient.get<CommonResponseBase<User>>(
          "https://api.artiexh.com/api/v1/account/me"
        );

        $user.set(data.data);

        if (mounted && isAuthPage) {
          router.push(ROUTE.HOME_PAGE);
        }
      } catch (error) {
        if (
          mounted &&
          !Object.values(NOT_REQUIRE_AUTH_ROUTE).some((path) =>
            pathname.includes(path)
          )
        ) {
          router.push(AUTH_ROUTE.SIGN_IN);
        }
      }
    };
    validate();

    return () => {
      mounted = false;
    };
  }, [pathname]);

  return null;
};

export default AuthGuard;
