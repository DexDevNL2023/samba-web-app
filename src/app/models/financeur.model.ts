import { BaseEntity } from "./base-entity.model";

export enum FinanceurType {
    ASSUREUR = 'ASSUREUR',
    MUTUELLE = 'MUTUELLE',
    ORGANISME_PUBLIC = 'ORGANISME_PUBLIC'
  }
  
export interface Financeur extends BaseEntity {
  nom?: string | null;
  description?: string | null;
  type?: keyof typeof FinanceurType | null;
  adresse?: string | null;
  telephone?: string | null;
  email?: string | null;
  prestations?: number[] | null;
}
  