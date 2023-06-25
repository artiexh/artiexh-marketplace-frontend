export type CartItem = {
  id: number;
  status: string;
  currency: string;
  name: string;
  price: number;
  description: string;
  type: string;
  remainingQuantity: string;
  publishDatetime: string;
  deliveryType: string;
  quantity: number;
  attaches: {
    id: number;
    url: string;
    type: string;
    title: string;
  }[];
};

export type CartSection = {
  artistInfo: {
    id: number;
    username: string;
    displayName: string;
    province: {
      id: number;
      name: string;
      country: {
        id: number;
        name: string;
      };
    };
  };
  items: CartItem[];
};

export type CartData = {
  artistItems: CartSection[];
};
