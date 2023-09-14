export type CartItem = {
  id: string;
  status: string;
  name: string;
  price: {
    amount: number;
    unit: string;
  };
  description: string;
  type: string;
  remainingQuantity: number;
  publishDatetime: string;
  deliveryType: string;
  quantity: number;
  thumbnailUrl: string;
};

export type CartSection = {
  shop: {
    id: string;
    shopName: string;
    imageUrl: string;
    owner: {
      id: string;
      username: string;
      displayName: string;
    };
  };
  items: CartItem[];
};

export type CartData = {
  shopItems: CartSection[];
};
