import { OwnerInfo } from "./Product";
import { Attaches } from "./common";

export type PostInformation = {
  id: string;
  createdDate: string;
  modifiedDate: string;
  attaches: Attaches[];
  likes: number;
  numOfComments: number;
  owner: OwnerInfo;
  description: string;
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

export type PostBody = {
  attaches: Attaches[];
  description: string;
};
