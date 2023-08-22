import NavBar from "@/containers/NavBar/Navbar";

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: ILayoutProps) => {
  return (
    <div>
      <NavBar />
      <div className="md:max-w-[90vw] mx-3 md:mx-auto my-0">
        <div className="my-[8rem]">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
