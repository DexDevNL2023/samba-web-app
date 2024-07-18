import { BaseEntity } from "./base-entity.model";
import { Sinistre } from "./sinistre.model";

export interface DocumentSinistre extends BaseEntity {
  nom?: string | null;
  description?: string | null;
  url?: string | null;
  dateTelechargement?: Date | null;
  sinistre?: Pick<Sinistre, 'id' | 'numeroSinistre' | 'raison' | 'dateDeclaration' | 'dateTraitement' | 'status'> | null;
}
  