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

export interface RecuPaiement extends BaseEntity {
  numeroRecu: string;        // Identifiant unique du reçu
  dateEmission: Date;        // Date d'émission du reçu
  montant: number;           // Montant payé
  details: string;           // Détails supplémentaires sur le paiement
}

export interface Paiement extends BaseEntity {
  numeroPaiement?: string | null;
  datePaiement?: Date | null;
  mode?: PaymentMode | null;
  montant?: number | null;
  type?: PaymentType | null;
  souscription?: number | null;
  reclamation?: number | null;
  recuPaiement?: number | null;
}