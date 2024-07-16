import { BaseEntity } from "./base-entity.model";
import { Sinistre } from "./sinistre.model";

export enum ReclamationStatus {
  EN_COURS = 'EN_COURS',
  RESOLUE = 'RESOLUE',
  REJETEE = 'REJETEE'
}

export interface Reclamation extends BaseEntity {
  numeroReclamation?: string | null;
  dateReclamation?: Date | null;
  description?: string | null;
  status?: keyof typeof ReclamationStatus | null;
  sinistre?: Pick<Sinistre, 'id'> | null;
}
