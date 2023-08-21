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
  artist: {
    id: string;
    username: string;
    displayName: string;
  };
  items: CartItem[];
};

export type CartData = {
  artistItems: CartSection[];
};
