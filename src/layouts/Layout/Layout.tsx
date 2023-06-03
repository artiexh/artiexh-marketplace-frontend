interface ILayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: ILayoutProps) => {
  return <div className="max-w-[80rem] mx-auto my-0">{children}</div>;
};

export default Layout;
