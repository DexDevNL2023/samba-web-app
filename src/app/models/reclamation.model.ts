import { BaseEntity } from "./base-entity.model";

export enum TypeReclamation {
  SINISTRE = 'SINISTRE',
  PRESTATION = 'PRESTATION'
}

export enum StatutReclamation {
  EN_COURS = 'EN_COURS',
  APPROUVEE = 'APPROUVEE',
  REJETEE = 'REJETEE',
  EN_ATTENTE = 'EN_ATTENTE'
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
}
