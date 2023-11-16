export type NavInfo = {
  id: string;
  label: string;
  iconPath: JSX.Element;
  href: string;
};

export type NavList = NavInfo[];

export type NavSection = {
  id: string;
  title?: string;
  navList: NavList;
};
