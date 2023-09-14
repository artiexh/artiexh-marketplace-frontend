import { useEffect } from "react";
import axiosClient from "../backend/axiosClient";
import { useRouter } from "next/router";
import { AUTH_ROUTE, NOT_REQUIRE_AUTH_ROUTE, ROUTE } from "@/constants/route";
import { usePathname } from "next/navigation";
import { setShop, setUser } from "@/store/user";
import { User } from "@/types/User";
import { CommonResponseBase } from "@/types/ResponseBase";
import { Shop } from "@/types/Shop";

const AuthGuard = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = Object.values(AUTH_ROUTE).includes(pathname || "");

  useEffect(() => {
    let mounted = true;
    const validate = async () => {
      try {
        const { data } = await axiosClient.get<CommonResponseBase<User>>(
          "https://api.artiexh.com/api/v1/account/me"
        );

        setUser(data.data);

        const { data: shopData } = await axiosClient.get<
          CommonResponseBase<Shop>
        >("/shop", {
          params: {
            ownerId: data.data.id,
          },
        });

        setShop(shopData.data);

        if (mounted && isAuthPage) {
          router.push(ROUTE.HOME_PAGE);
        }
      } catch (error) {
        if (
          mounted &&
          !Object.values(NOT_REQUIRE_AUTH_ROUTE).some((path) =>
            pathname?.includes(path)
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
