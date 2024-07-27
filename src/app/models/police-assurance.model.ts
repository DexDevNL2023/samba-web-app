import { BaseEntity } from "./base-entity.model";

export interface PoliceAssurance extends BaseEntity {
  numeroPolice?: string | null;
  label?: string | null;
  conditions?: string | null;
  montantSouscription: number | null;
  assurance?: number | null;
  garanties?: number[] | null;
  souscriptions?: number[] | null;
}