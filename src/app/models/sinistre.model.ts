import { BaseEntity } from "./base-entity.model";

export enum SinistreStatus {
  EN_COURS = 'EN COURS',
  APPROUVE = 'APPROUVE',
  CLOTURE = 'CLOTURE',
  REJETE = 'REJETE'
}

export interface Sinistre extends BaseEntity {
  numeroSinistre?: string | null;
  label?: string | null;
  raison?: string | null;
  dateSurvenance?: Date | null;
  dateDeclaration?: Date | null;
  dateReglement?: Date | null;
  datePaiement?: Date | null;
  dateCloture?: Date | null;
  status?: keyof typeof SinistreStatus | null;
  montantSinistre?: number | null;
  montantAssure?: number | null;
  souscription?: number | null;
  prestations?: number[] | null;
  documents?: number[] | null;
}