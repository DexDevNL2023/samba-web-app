import { BaseEntity } from "./base-entity.model";

export enum GarantieStatus {
  ACTIVEE = 'ACTIVEE',
  EXPIREE = 'EXPIREE',
  SUSPENDUE = 'SUSPENDUE'
}
  
export interface Garantie extends BaseEntity {
  numeroGarantie?: string | null;
  label?: string | null;
  percentage: number | null;
  termes?: string | null;
  plafondAssure?: number | null;
  dateDebut?: Date | null;
  dateFin?: Date | null;
  status?: keyof typeof GarantieStatus | null;
  polices?: number[] | null;
}
  