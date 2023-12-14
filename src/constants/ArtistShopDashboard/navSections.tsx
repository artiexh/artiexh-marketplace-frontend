import {
  IconBrandCampaignmonitor,
  IconBuildingStore,
  IconBuildingWarehouse,
  IconPackageExport,
  IconShoppingBag,
  IconTemplate,
} from "@tabler/icons-react";

export const navSections = [
  {
    id: "DASHBOARD",
    navList: [
      {
        id: "INVENTORY",
        label: "Product inventory",
        iconPath: <IconPackageExport />,
        href: "/my-shop/products",
      },
      {
        id: "PRODUCTS",
        label: "Custom Products",
        iconPath: <IconTemplate />,
        href: "/my-shop/custom-products",
      },
      {
        id: "CAMPAIGNS",
        label: "Campaign requests",
        iconPath: <IconBrandCampaignmonitor />,
        href: "/my-shop/campaigns",
      },
      {
        id: "SALE_CAMPAIGNS",
        label: "Sale campaigns",
        iconPath: <IconBuildingStore />,
        href: "/my-shop/sale-campaigns",
      },
      {
        id: "SHOP_PROFILE",
        label: "Thông tin Shop",
        iconPath: <IconBuildingWarehouse />,
        href: "/my-shop/profile",
      },
    ],
  },
];
