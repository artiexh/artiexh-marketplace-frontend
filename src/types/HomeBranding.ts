export type Campaign = {
  id: string;
  url: string;
};

export type Promotion = {
  id: string;
  url: string;
};

export type HomeBranding = {
  campaigns: Campaign[];
  promotions: Promotion[];
};
