export type NotificationType = {
  id: string;
  title: string;
  content: string;
  type: string;
  createdDate: string;
  modifiedDate: string;
  readAt?: string;
  referenceData: {
    id: string;
    referenceEntity: string;
  };
};
