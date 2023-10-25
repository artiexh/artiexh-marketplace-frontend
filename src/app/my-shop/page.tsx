"use client";

import { usePathname, useRouter } from "next/navigation";

const ShopProductsPage = () => {
  const router = useRouter();
  const pathname = usePathname();

  router.push("/my-shop/custom-products");

  return null;
};

export default ShopProductsPage;
