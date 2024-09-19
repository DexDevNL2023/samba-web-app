import { BaseEntity } from './base-entity.model';

export enum RecuPaymentType {
  ENCAISSEMENT = 'ENCAISSEMENT',
  DECAISSEMENT = 'DECAISSEMENT'
}

export interface RecuPaiement extends BaseEntity {
  numeroRecu?: string | null;        // Identifiant unique du reçu
  dateEmission?: Date | null;        // Date d'émission du reçu
  type?: keyof typeof RecuPaymentType | null;  // Type of payment (ENCAISSEMENT or DECAISSEMENT)
  montant?: number | null;          // Montant payé
  details?: string | null;          // Détails supplémentaires sur le paiement
  paiement?: number | null;         // ID du paiement associé
}