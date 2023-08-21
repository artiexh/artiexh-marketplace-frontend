import NavBar from "@/containers/NavBar/Navbar";

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: ILayoutProps) => {
  return (
    <div>
      <NavBar />
      <div className="max-w-[80rem] mx-6 lg:mx-auto my-0">
        <div className="my-[8rem]">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
