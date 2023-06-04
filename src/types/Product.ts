export type Tag = {
  name: string;
  description: string;
  color: string;
};

export type Product = {
  name: string;
  shop: string;
  price: Price;
  images: string[];
};

export type Price = {
  value: number;
  unit: string;
};
