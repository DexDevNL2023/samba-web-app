import { BaseEntity } from "./base-entity.model";

export interface LiteRegistrant extends BaseEntity {
  numeroRegistrant?: string | null;
  branche?: number | null;
  partenaire?: number | null;
}
