import { BaseEntity } from "./base-entity.model";
import { PrestationSoin } from "./prestation-soin.model";

export enum FinanceurType {
    ASSUREUR = 'ASSUREUR',
    MUTUELLE = 'MUTUELLE',
    ORGANISME_PUBLIC = 'ORGANISME PUBLIC'
  }
  
  export interface FinanceurSoin extends BaseEntity {
  nom?: string | null;
  type?: keyof typeof FinanceurType | null;
  adresse?: string | null;
  telephone?: string | null;
  email?: string | null;
  prestations?: Pick<PrestationSoin, 'id'>[] | null;
}
  