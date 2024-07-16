import { BaseEntity } from "./base-entity.model";
import { Fournisseur } from "./fournisseur.model";
import { PrestationSoin } from "./prestation-soin.model";
import { Reclamation } from "./reclamation.model";
import { Souscription } from "./souscription.model";
import { DocumentSinistre } from './document-sinistre.model';

export enum ClaimStatus {
  EN_ATTENTE = 'EN_ATTENTE',
  APPROUVE = 'APPROUVE',
  ANNULE = 'ANNULE'
}

export interface Sinistre extends BaseEntity {
  numeroSinistre?: string | null;
  dateDeclaration?: Date | null;
  dateTraitement?: Date | null;
  status?: keyof typeof ClaimStatus | null;
  raison?: string | null;
  montantReclame?: number | null;
  montantApprouve?: number | null;
  souscription?: Pick<Souscription, 'id'> | null;
  fournisseur?: Pick<Fournisseur, 'id'> | null;
  prestationSoin?: Pick<PrestationSoin, 'id'> | null;
  reclamations?: Pick<Reclamation, 'id'>[] | null;
  documents?: Pick<DocumentSinistre, 'id'>[] | null;
}