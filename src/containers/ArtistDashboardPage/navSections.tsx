import artistProductColumns from "../TableColumn/ArtistProductColumn";
import TableContainer from "../TableContainer";

export const navSections = [
  {
    id: "DASHBOARD",
    navList: [
      {
        id: "DASHBOARD",
        label: "Dashboard",
        iconPath: "/assets/icons/dashboard_icon.svg",
      },
      {
        id: "TABLE",
        label: "Table",
        iconPath: "/assets/icons/tables_icon.svg",
      },
      {
        id: "BILLING",
        label: "Billing",
        iconPath: "/assets/icons/billing_icon.svg",
      },
      {
        id: "VIRTUAL_REALITY",
        label: "Virtual Reality",
        iconPath: "/assets/icons/virtual_reality_icon.svg",
      },
      {
        id: "RTL",
        label: "RTL",
        iconPath: "/assets/icons/rtl_icon.svg",
      },
    ],
  },
  {
    id: "ACCOUNT",
    title: "ACCOUNT PAGES",
    navList: [
      {
        id: "PROFILE",
        label: "Profile",
        iconPath: "/assets/icons/profile_icon.svg",
      },
      {
        id: "SIGN_IN",
        label: "Sign In",
        iconPath: "/assets/icons/sign_in_icon.svg",
      },
      {
        id: "SIGN_UP",
        label: "Sign Up",
        iconPath: "/assets/icons/sign_up_icon.svg",
      },
    ],
  },
];

export const navContents: Record<string, JSX.Element> = {
  DASHBOARD: (
    <TableContainer pathName="products" columns={artistProductColumns} />
  ),
  TABLE: <div>Table</div>,
  BILLING: <div>Billing</div>,
  VIRTUAL_REALITY: <div>Virtual Reality</div>,
  RTL: <div>RTL</div>,
  PROFILE: <div>Profile</div>,
  SIGN_IN: <div>Sign In</div>,
  SIGN_UP: <div>Sign Up</div>,
};
