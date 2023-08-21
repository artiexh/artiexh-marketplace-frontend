export type User = {
  id: number;
  username: string;
  status: string;
  displayName: string;
  role: string;
  avatarUrl?: string;
  subscriptionsTo: object[];
  email?: string;
  province: {
    id: string;
    name: string;
    country: {
      id: string;
      name: string;
    };
  };
};
