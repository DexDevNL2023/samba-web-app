import { BaseEntity } from "./base-entity.model";

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  ON_RISK = 'ON_RISK',
  WAITING = 'WAITING',
  RESILIE = 'RESILIE'
}
  
export enum PaymentFrequency {
  MENSUEL = 'MENSUEL',
  TRIMESTRIEL = 'TRIMESTRIEL',
  SEMESTRIEL = 'SEMESTRIEL',
  ANNUEL = 'ANNUEL'
}

export interface Souscription extends BaseEntity {
  numeroSouscription?: string | null;
  dateSouscription?: Date | null;
  dateExpiration?: Date | null;
  montantCotisation?: number | null;
  status?: keyof typeof SubscriptionStatus | null;
  frequencePaiement?: keyof typeof PaymentFrequency | null;
  assure?: number | null;
  police?: number | null;
  contrat?: number | null;
  paiements?: number[] | null;
  sinistres?: number[] | null;
  reclamations?: number[] | null;
}
