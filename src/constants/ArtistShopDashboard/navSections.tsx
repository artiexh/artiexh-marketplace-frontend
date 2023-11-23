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
        id: "ORDERS",
        label: "Orders",
        iconPath: <IconShoppingBag />,
        href: "/my-shop/orders",
      },
      {
        id: "INVENTORY",
        label: "Products",
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
        label: "Shop profile",
        iconPath: <IconBuildingWarehouse />,
        href: "/my-shop/profile",
      },
    ],
  },
];
