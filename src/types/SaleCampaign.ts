export type SaleCampaignDetail = {
  content: string;
  createdBy: string;
  createdDate: string;
  description: string;
  from: string;
  id: string;
  modifiedDate: string;
  name: string;
  owner: {
    avatarUrl: string;
    displayName: string;
    id: string;
    province: {
      country: {
        id: string;
        name: string;
      };
      id: string;
      name: string;
    };
    username: string;
  };
  publicDate: string;
  thumbnailUrl: string;
  to: string;
  type: "SHARE" | "PRIVATE" | "PUBLIC";
};
