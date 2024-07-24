import { BaseEntity } from "./base-entity.model";

export enum RapportType {
  PERFORMANCE = 'PERFORMANCE',
  PAIEMENT = 'PAIEMENT',
  SINISTRE = 'SINISTRE'
}
  
export interface Rapport extends BaseEntity {
  titre?: string | null;
  description?: string | null;
  type?: keyof typeof RapportType | null;
  dateGeneration?: Date | null;
  url?: string | null;
  assurance?: number | null;
}