export type NavInfo = {
  id: string;
  label: string;
  iconPath: string;
  href: string;
};

export type NavList = NavInfo[];

export type NavSection = {
  id: string;
  title?: string;
  navList: NavList;
};
