import { BaseEntity } from "./base-entity.model";
import { UserExtra } from "./user-extra.model";

export enum NotificationType {
  PAIEMENT = 'PAIEMENT',
  SOUSCRIPTION = 'SOUSCRIPTION',
  SINISTRE = 'SINISTRE',
  REQUEST = 'REQUEST'
}
  
export interface Notification extends BaseEntity {
  message?: string | null;
  dateEnvoi?: Date | null;
  type?: keyof typeof NotificationType | null;
  isRead: Boolean | null;
  utilisateur?: Pick<UserExtra, 'id'> | null;
}
