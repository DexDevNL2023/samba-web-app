import { BaseEntity } from "./base-entity.model";
import { Souscription } from "./souscription.model";

export enum PaymentType {
  PRIME = 'PRIME',
  REMBOURSEMENT = 'REMBOURSEMENT',
  PRESTATION = 'PRESTATION'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}
 
export interface Paiement extends BaseEntity {
  numeroPaiement?: string | null;
  datePaiement?: Date | null;
  montant?: number | null;
  type?: keyof typeof PaymentType | null;
  status?: keyof typeof PaymentStatus | null;
  souscription?: Pick<Souscription, 'id' | 'numeroSouscription' | 'dateSouscription' | 'dateExpiration' | 'status' | 'frequencePaiement'> | null;
}