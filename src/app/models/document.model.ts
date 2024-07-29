import { BaseEntity } from "./base-entity.model";

export interface Document extends BaseEntity {
  numeroDocument?: string | null;
  nom?: string | null;
  description?: string | null;
  url?: string | null;
}
  