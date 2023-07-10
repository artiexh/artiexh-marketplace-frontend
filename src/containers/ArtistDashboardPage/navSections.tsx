import ArtistCampaignTableContainer from "./ArtistCampaignTable";
import ArtistOrderTableContainer from "./ArtistOrderTable";
import ArtistProductTableContainer from "./ArtistProductTable";

export const navSections = [
  {
    id: "DASHBOARD",
    navList: [
      {
        id: "PRODUCTS",
        label: "Products",
        iconPath: "dashboard_icon.svg",
      },
      {
        id: "ORDERS",
        label: "Orders",
        iconPath: "tables_icon.svg",
      },
      {
        id: "CAMPAIGNS",
        label: "Campaigns",
        iconPath: "billing_icon.svg",
      },
      {
        id: "VIRTUAL_REALITY",
        label: "Virtual Reality",
        iconPath: "virtual_reality_icon.svg",
      },
      {
        id: "RTL",
        label: "RTL",
        iconPath: "rtl_icon.svg",
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
        iconPath: "profile_icon.svg",
      },
      {
        id: "SIGN_IN",
        label: "Sign In",
        iconPath: "sign_in_icon.svg",
      },
      {
        id: "SIGN_UP",
        label: "Sign Up",
        iconPath: "sign_up_icon.svg",
      },
    ],
  },
];

export const navContents: Record<string, JSX.Element> = {
  PRODUCTS: <ArtistProductTableContainer />,
  ORDERS: <ArtistOrderTableContainer />,
  CAMPAIGNS: <ArtistCampaignTableContainer />,
  VIRTUAL_REALITY: <div>Virtual Reality</div>,
  RTL: <div>RTL</div>,
  PROFILE: <div>Profile</div>,
  SIGN_IN: <div>Sign In</div>,
  SIGN_UP: <div>Sign Up</div>,
};
