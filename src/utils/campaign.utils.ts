export const isDisabled = (status: string) =>
  status !== "DRAFT" && status !== "REQUEST_CHANGE";
