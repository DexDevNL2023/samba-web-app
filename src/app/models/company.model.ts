
import { BaseEntity } from './base-entity.model';

export interface Company extends BaseEntity {
  name?: string | null;
  sigle?: string | null;
  email?: string | null;
  telephone?: string | null;
  site?: string | null;
  telephone2?: string | null;
  adresse?: string | null;
  ville?: string | null;
  bp?: string | null;
  logo?: string | null;
  enteteGauche?: string | null;
  enteteDroite?: string | null;
  piedPage?: string | null;
}
