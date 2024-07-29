import { BaseEntity } from "./base-entity.model";

export enum ClaimStatus {
  EN_ATTENTE = 'EN_ATTENTE',
  APPROUVE = 'APPROUVE',
  ANNULE = 'ANNULE'
}

export interface Sinistre extends BaseEntity {
  numeroSinistre?: string | null;
  label?: string | null;
  raison?: string | null;
  dateDeclaration?: Date | null;
  dateTraitement?: Date | null;
  status?: keyof typeof ClaimStatus | null;
  montantSinistre?: number | null;
  montantAssure?: number | null;
  souscription?: number | null;
  prestations?: number[] | null;
  reclamations?: number[] | null;
  documents?: number[] | null;
}