export type PostInformation = {
  id: string;
  createdAt: string;
  content: string;
  attachment: string;
  totalLike: number;
  comments: Comment[];
};

export type Comment = {
  createdAt: string;
  author: {
    id: string;
    avatarUrl: string;
    name: string;
  };
  content: string;
};
