interface ILayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: ILayoutProps) => {
  return (
    <>
      <div className="nav-bar h-10 lg:h-20"></div>
      <div className="max-w-[80rem] mx-6 md:mx-auto my-0">{children}</div>
    </>
  );
};

export default Layout;
