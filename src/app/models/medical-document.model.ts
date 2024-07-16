import { BaseEntity } from "./base-entity.model";
import { MedicalRecord } from "./medical-record.model";

export interface MedicalDocument extends BaseEntity {
  nom?: string | null;
  description?: string | null;
  url?: string | null;
  dossier?: Pick<MedicalRecord, 'id'> | null;
}
  