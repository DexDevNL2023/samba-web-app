import { BaseEntity } from "./base-entity.model";

export enum TypeNotification {
  INFO = 'INFO',
  PAYMENT = 'PAYMENT',
  REMINDER = 'REMINDER',
  CLAIM = 'CLAIM',
  PROFILE = 'PROFILE',
}
  
export interface Notification extends BaseEntity {
  titre?: string | null;
  message?: string | null;
  dateEnvoi?: Date | null;
  lu?: boolean | null;
  typeNotification?: TypeNotification | null;
  destinataireId?: number | null;
  envoyeurId?: number | null;
}
