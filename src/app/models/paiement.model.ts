import { BaseEntity } from "./base-entity.model";

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

export interface RecuPaiement extends BaseEntity {
  numeroRecu: string;        // Identifiant unique du reçu
  dateEmission: Date;        // Date d'émission du reçu
  montant: number;           // Montant payé
  details: string;           // Détails supplémentaires sur le paiement
}

export interface Paiement extends BaseEntity {
  numeroPaiement?: string | null;
  datePaiement?: Date | null;
  montant?: number | null;
  type?: keyof typeof PaymentType | null;
  status?: keyof typeof PaymentStatus | null;
  souscription?: number | null;
  recuPaiement?: number | null;
}