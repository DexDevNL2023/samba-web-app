import { BaseEntity } from "./base-entity.model";

export interface EntityByRegistrant<T extends BaseEntity> {
  name?: string | null;
  data?: T[] | null;
}
