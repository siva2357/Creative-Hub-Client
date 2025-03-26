import { ApiSearchParams } from "./api-pagination-params";

export class Notification {
    id?: string;
    userId?: string;
    title?: string;
    message?: string;
    isRead?: boolean;
    attachments?: string[];
    data?: any;
    error?: string;
    attempts?: number;
    createdBy?: string;
    createdDate?: string;
    modifiedBy?: string;
    modifiedDate?: string;
    sentAt?: string;
    status?: string;
    linked2Type?: string;
    linked2Id?: string;
    createdBy__Name__?: string;
    modifiedBy__Name__?: string;
}

export class NotificationData {
  title?: string;
  startTime?: string;
  endTime?: string;
}

export class NotificationSearchParams extends ApiSearchParams {
  constructor() {
      super();
  }

  includeRead?: boolean;
}
