import { Assurance } from "./assurance.model";
import { BaseEntity } from "./base-entity.model";
import { Garantie } from "./garantie.model";
import { Souscription } from "./souscription.model";

export interface PoliceAssurance extends BaseEntity {
  numeroPolice?: string | null;
  label?: string | null;
  estDeTypeSante?: boolean | null;
  conditions?: string | null;
  percentage: number | null;
  montantSouscription: number | null;
  assurance?: Pick<Assurance, 'id'> | null;
  garanties?: Pick<Garantie, 'id'>[] | null;
  souscriptions?: Pick<Souscription, 'id'>[] | null;
}