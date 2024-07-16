import { BaseEntity } from "./base-entity.model";
import { EntityByRegistrant } from "./entity-by-registrant.model";

export interface EntityByBranch<T extends BaseEntity> {
  name?: string | null;
  partenaires?: EntityByRegistrant<T>[] | null;
}
