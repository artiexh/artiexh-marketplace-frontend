import tunnel from "tunnel-rat";

export const r3f = tunnel();

export const createImageUrl = (buffer: BlobPart, type: string) => {
  const blob = new Blob([buffer], { type });
  const urlCreator = window.URL || window.webkitURL;
  const imageUrl = urlCreator.createObjectURL(blob);
  console.log(imageUrl);
  return imageUrl;
};
