export type Tag = {
  name: string;
  description: string;
  color: string;
};

export type Product = {
  name: string;
  shop: string;
  price: string;
  images: string[];
};

export type DashboardProduct = {
  id: string;
  shop: string;
  price: string;
};
