import { useEffect, useState } from "react";
import axiosClient from "../backend/axiosClient";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { AUTH_ROUTE, NOT_REQUIRE_AUTH_ROUTE, ROUTE } from "@/constants/route";
import { usePathname } from "next/navigation";

const AuthGuard = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = Object.values(AUTH_ROUTE).includes(pathname);

  useEffect(() => {
    let mounted = true;
    const validate = async () => {
      try {
        const { data } = await axiosClient.get(
          "https://api.artiexh.com/api/v1/account/me"
        );

        if (mounted && isAuthPage) {
          router.push(ROUTE.HOME_PAGE);
        }
      } catch (error) {
        console.log(pathname);
        if (
          mounted &&
          !Object.values(NOT_REQUIRE_AUTH_ROUTE).some((path) =>
            pathname.includes(path)
          )
        ) {
          console.log(111);
          router.push(AUTH_ROUTE.SIGN_IN);
        }
        const axiosError = error as AxiosError;
        console.log(axiosError);
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
