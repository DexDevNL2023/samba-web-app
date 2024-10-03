import { BaseEntity } from "./base-entity.model";

export enum PaymentType {
  PRIME = 'PRIME',
  REMBOURSEMENT = 'REMBOURSEMENT',
  PRESTATION = 'PRESTATION'
}

export enum PaymentMode {
  BANK_TRANSFER = 'VIREMENT BANCAIRE',
  CASH = 'ESPÈCES',
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
  MOOV = 'MOOV_MONEY',
  AIRTEL = 'AIRTEL_MONEY'
}

export interface Paiement extends BaseEntity {
  numeroPaiement?: string | null;
  datePaiement?: Date | null;
  mode?: keyof typeof PaymentMode | null;
  montant?: number | null;
  type?: keyof typeof PaymentType | null;
  souscription?: number | null;
  reclamation?: number | null;
  recuPaiements?: number[] | null;
}