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

  if (pathname?.includes("product-design")) return children;

  return (
    <div>
      <NavBar />
      <div className="md:max-w-[90vw] mx-3 md:mx-auto my-0">
        <div className={clsx(!isAuthPage && "my-[8rem]")}>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
