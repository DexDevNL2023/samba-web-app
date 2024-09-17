import { BaseEntity } from "./base-entity.model";

export enum TypeReclamation {
  SINISTRE = 'SINISTRE',
  PRESTATION = 'PRESTATION'
}

export enum StatutReclamation {
  EN_COURS = 'EN_COURS',
  APPROUVEE = 'APPROUVEE',
  REJETEE = 'REJETEE'
}

export interface Reclamation extends BaseEntity {
  numeroReclamation?: string | null;
  type?: TypeReclamation | null;
  dateReclamation?: Date | null;
  status?: StatutReclamation | null;
  description?: string | null;
  montantReclame?: number | null;
  montantApprouve?: number | null;
  dateEvaluation?: Date | null;
  agentEvaluateur?: string | null;
  justification?: string | null;
  souscription?: number | null;
  sinistre?: number | null;
  prestation?: number | null;
  paiements?: number[] | null;
}
