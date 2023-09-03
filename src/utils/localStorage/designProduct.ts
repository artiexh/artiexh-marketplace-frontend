import {
  CollectionProductBase,
  ProvidedProductBase,
} from "@/components/Cards/ProvidedProductBaseCard/ProvidedProductBaseCard";

export type DesignItem = {
  status: "FINISHED" | "DESIGNING";
  id: string;
  product: ProvidedProductBase;
  thumbnail: string;
  collection?: Omit<CollectionProductBase, "items">;
};

export const setDesignItemsToLocalStorage = (products: DesignItem[]) => {
  localStorage.setItem("DESIGN_PRODUCTS", JSON.stringify(products));
};

export const getDesignItemsFromLocalStorage = (): DesignItem[] => {
  const storedProducts = localStorage.getItem("DESIGN_PRODUCTS");
  if (!storedProducts) {
    return [];
  }
  return JSON.parse(storedProducts);
};
