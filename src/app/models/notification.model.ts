import { BaseEntity } from "./base-entity.model";

export enum TypeNotification {
  INFO = 'INFO',
  PAYMENT = 'PAYMENT',
  REMINDER = 'REMINDER',
  CLAIM = 'CLAIM',
  PROFILE = 'PROFILE',
}
  
export interface Notification extends BaseEntity {
  lu?: boolean | null;
  titre?: string | null;
  type?: keyof typeof TypeNotification | null;
  message?: string | null;
  dateEnvoi?: Date | null;
  destinataire?: number | null;
  emetteur?: number | null;
}
