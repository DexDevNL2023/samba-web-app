import { BaseEntity } from "./base-entity.model";

export interface Fournisseur extends BaseEntity {
  nom?: string | null;
  telephone?: string | null;
  email?: string | null;
  adresse?: string | null;
  servicesFournis?: string | null;
  account?: number | null;
  prestations?: number[] | null;
  branches?: number[] | null;
  registrants?: number[] | null;
}
