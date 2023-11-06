export const CAMPAIGN_TYPE_DATA = {
  IN_GOING: {
    bgImg: "",
    title: "Đang diễn ra",
    borderStyle: "border-[#C83C2B]",
    textStyle: "bg-[#C83C2B] text-white",
    bannerStyle:
      "bg-[url('https://i.pinimg.com/564x/ca/65/57/ca6557651c47775b4d4d2da5a8641773.jpg')] !text-white",
  },
  IN_COMING: {
    bgImg: "",
    title: "Sắp mở",
    borderStyle: "border-[#FFE9C3]",
    textStyle: "bg-[#FFE9C3] text-[#804F34]",
    bannerStyle:
      "bg-[url('https://i.pinimg.com/564x/b7/49/df/b749dfe9cc0b20167d7e162e78f27f8b.jpg')] !text-black",
  },
  PRE_ORDER: {
    bgImg: "",
    title: "Mở bán trước",
    borderStyle: "",
    textStyle: "",
    bannerStyle:
      "bg-[url('https://png.pngtree.com/background/20210710/original/pngtree-simple-red-background-picture-image_977898.jpg')]",
  },
  CLOSED: {
    bgImg: "",
    title: "Đã đóng",
    borderStyle: "border-[#808080]",
    textStyle: "bg-[#808080] text-white",
    bannerStyle:
      "bg-[url('https://png.pngtree.com/background/20210710/original/pngtree-simple-red-background-picture-image_977898.jpg')]",
  },
} as const;

export type CAMPAIGN_TYPE = keyof typeof CAMPAIGN_TYPE_DATA;

export const campaignData = [
  {
    id: "501792469659339448",
    status: "MANUFACTURING",
    thumbnailUrl:
      "https://images.augustman.com/wp-content/uploads/sites/2/2023/04/26131013/dragon-bll.jpeg",
    owner: {
      id: "485419044935756839",
      username: "user1",
      displayName: "pokemon",
      avatarUrl:
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
    },
    name: "Zo tri",
    description: "Hello",
    type: "PRIVATE",
    isPublished: true,
  },
  {
    id: "502377299741098267",
    status: "MANUFACTURING",
    thumbnailUrl:
      "https://i.etsystatic.com/21401357/r/il/3a17a3/2296928239/il_1080xN.2296928239_9bcj.jpg",
    owner: {
      id: "485419044935756839",
      username: "user1",
      displayName: "pokemon",
      avatarUrl:
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
    },
    name: "Campaign ne",
    description: "Hiahaii",
    type: "SHARE",
    isPublished: true,
  },
  {
    id: "502380128224528271",
    status: "CANCELED",
    thumbnailUrl:
      "https://i.etsystatic.com/26600561/r/il/16603e/3909068076/il_fullxfull.3909068076_d374.jpg",
    owner: {
      id: "485419044935756839",
      username: "user1",
      displayName: "pokemon",
      avatarUrl:
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
    },
    name: "hehheheaaa121",
    description: "aaaaasaasasasaassaasas333",
    type: "SHARE",
    isPublished: true,
  },
  {
    id: "502810651362748928",
    status: "MANUFACTURING",
    thumbnailUrl:
      "https://eu-images.contentstack.com/v3/assets/blt781c383a1983f673/bltbeb615cd1089cb7b/6250a373bfb6ec0b397f075c/41122tsubasa.png",
    owner: {
      id: "485419044935756839",
      username: "user1",
      displayName: "pokemon",
      avatarUrl:
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
    },
    name: "Săn sale 20/10",
    description: "Sale 20/10 với thật nhiều ưu đãi",
    type: "PRIVATE",
    isPublished: true,
  },
];
