import { AUTH_ROUTE } from "@/constants/route";
import NavBar from "@/containers/NavBar/Navbar";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: ILayoutProps) => {
  const pathname = usePathname();

  const isAuthPage = Object.values(AUTH_ROUTE).includes(pathname || "");

  if (pathname?.includes("/design")) return children;

  return (
    <>
      <NavBar />
      <div
        className={clsx(
          "md:mx-auto my-0 px-2",
          !isAuthPage && "md:max-w-[1280px]"
        )}
      >
        <div className={clsx("", !isAuthPage && "my-[8rem]")}>{children}</div>
      </div>
    </>
  );
};

export default Layout;
