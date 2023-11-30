import { OwnerInfo } from "./Product";
import { User } from "./User";
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
  id: string;
  createdAt: string;
  owner: User;
  content: string;
  createdDate: string;
};

export type PostBody = {
  attaches: Attaches[];
  description: string;
};
