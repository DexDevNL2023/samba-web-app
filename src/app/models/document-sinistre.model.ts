import { BaseEntity } from "./base-entity.model";
import { Sinistre } from "./sinistre.model";

export interface DocumentSinistre extends BaseEntity {
  nom?: string | null;
  description?: string | null;
  url?: string | null;
  sinistre?: number | null;
}
  