import { createContext } from "react";

const MetaContext = createContext<{
  changePalette: (
    callback: (prev: {
      strap?: string;
      body?: string;
      embroideryLine?: string;
    }) => {
      strap?: string;
      body?: string;
      embroideryLine?: string;
    }
  ) => void;
  uploadImages: (callback: (images: any[]) => any[]) => void;
  changeImageMode: (value: "FULL_MIDDLE" | "BOTTOM_LEFT_CORNER") => void;
  value: {
    palette: { strap?: string; body?: string; embroideryLine?: string };
    imagesContext: {
      combination: "FULL_MIDDLE" | "BOTTOM_LEFT_CORNER";
      images: any[];
    };
  };
}>({
  changePalette: () => {},
  uploadImages: () => {},
  changeImageMode: () => {},
  value: {
    palette: {},
    imagesContext: {
      combination: "FULL_MIDDLE",
      images: [],
    },
  },
});

export default MetaContext;
