export const isDisabled = (status: string) =>
  status !== "DRAFT" && status !== "REQUEST_CHANGE";

export const configCalculate = (
  price: number,
  manufacturingPrice: number,
  percentage: number
) => {
  const adminProfit = ((price - manufacturingPrice) * percentage) / 100;
  return {
    adminProfit,
    artistProfit: price - manufacturingPrice - adminProfit,
  };
};
