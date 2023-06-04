export type User = {
  id: number;
  username: string;
  status: string;
  role: string;
  avatarUrl?: string;
  subscriptionsTo: object[];
  email?: string;
};
