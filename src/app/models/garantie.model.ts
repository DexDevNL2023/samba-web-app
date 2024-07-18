import { BaseEntity } from "./base-entity.model";
import { PoliceAssurance } from "./police-assurance.model";

export enum GarantieStatus {
  ACTIVE = 'ACTIVE',
  EXPIREE = 'EXPIREE',
  SUSPENDUE = 'SUSPENDUE'
}
  
export interface Garantie extends BaseEntity {
  description?: string | null;
  montantAssure?: number | null;
  plafondAssure?: number | null;
  dateDebut?: Date | null;
  dateFin?: Date | null;
  status?: keyof typeof GarantieStatus | null;
  polices?: Pick<PoliceAssurance, 'id' | 'numeroPolice'| 'label' | 'estDeTypeSante' | 'montantSouscription'>[] | null;
}
  