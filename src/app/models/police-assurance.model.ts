import { BaseEntity } from "./base-entity.model";

export interface PoliceAssurance extends BaseEntity {
  numeroPolice?: string | null;
  imageUrl?: string | null;
  label?: string | null;
  dureeCouverture?: number;
  conditions?: string | null;
  montantSouscription: number | null;
  assurance?: number | null;
  garanties?: number[] | null;
  souscriptions?: number[] | null;
}