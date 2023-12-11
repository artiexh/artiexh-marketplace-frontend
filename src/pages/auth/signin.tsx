import { ROUTE } from "@/constants/route";
import SignInFormContainer from "@/containers/SignInFormContainer/SignInFormContainer";
import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import Link from "next/link";

const SignInPage = () => {
  return (
    <div className="flex h-screen sm:bg-white bg-accent sm:flex-row flex-col items-center justify-center gap-5 sm:gap-0 px-5 sm:px-0">
      <div className="logo-wrapper_mobile sm:hidden">
        <Image
          src="/assets/logo.svg"
          alt=""
          width={100}
          height={100}
          className="aspect-square mx-auto"
        />
        <h1 className="font-bold text-primary mt-1">Artiexh</h1>
      </div>
      <div className="flex flex-col w-full sm:flex-1 gap-3">
        <div className="header_desktop hidden sm:flex flex-col">
          <h1 className="font-bold text-primary w-full max-w-xs mx-auto">
            Arty
          </h1>
          <h2 className="text-subtext max-w-xs mx-auto w-full">
            Chưa có tài khoản?{" "}
            <Link href="/auth/signup" className="text-secondary">
              Tạo ngay
            </Link>
          </h2>
        </div>
        <SignInFormContainer />
      </div>
      <div className="sm:flex flex-col flex-1 gap-3 hidden items-center justify-center bg-accent h-full">
        <Image
          src="/assets/logo.svg"
          alt=""
          width={300}
          height={300}
          className="aspect-square mx-auto"
        />
      </div>
      <div className="footer-wrapper_mobile sm:hidden">
        Chưa có tài khoản?{" "}
        <Link href="/auth/signup" className="font-bold text-primary">
          Tạo ngay
        </Link>
      </div>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const cookies = context.req.cookies;
  if (cookies[process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY as string])
    return { redirect: { destination: ROUTE.HOME_PAGE, permanent: false } };
  return {
    props: {},
  };
}

export default SignInPage;
