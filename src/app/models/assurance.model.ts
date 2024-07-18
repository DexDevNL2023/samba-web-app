import { BaseEntity } from "./base-entity.model";
import { PoliceAssurance } from "./police-assurance.model";
import { Rapport } from "./rapport.model";

export enum InsuranceType {
  PERSONNE = 'PERSONNE',
  BIEN = 'BIEN',
  AGRICOLE = 'AGRICOLE'
}
  
export interface Assurance extends BaseEntity {
  nom?: string | null;
  description?: string | null;
  type?: keyof typeof InsuranceType | null;
  polices?: Pick<PoliceAssurance, 'id' | 'numeroPolice'| 'label' | 'estDeTypeSante' | 'montantSouscription'>[] | null;
  rapports?: Pick<Rapport, 'id' | 'titre' | 'dateGeneration' | 'url'>[] | null;
}
  