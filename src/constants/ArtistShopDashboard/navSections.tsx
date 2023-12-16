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
        label: "Hàng trong kho",
        iconPath: <IconPackageExport />,
        href: "/my-shop/products",
      },
      {
        id: "PRODUCTS",
        label: "Sản phẩm tùy chỉnh",
        iconPath: <IconTemplate />,
        href: "/my-shop/custom-products",
      },
      {
        id: "CAMPAIGNS",
        label: "Yêu cầu chiến dịch",
        iconPath: <IconBrandCampaignmonitor />,
        href: "/my-shop/campaigns",
      },
      {
        id: "SALE_CAMPAIGNS",
        label: "Chiến dịch",
        iconPath: <IconBuildingStore />,
        href: "/my-shop/sale-campaigns",
      },
      {
        id: "SHOP_PROFILE",
        label: "Thông tin cửa hàng",
        iconPath: <IconBuildingWarehouse />,
        href: "/my-shop/profile",
      },
    ],
  },
];
