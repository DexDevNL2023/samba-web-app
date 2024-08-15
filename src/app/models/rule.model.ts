import { BaseEntity } from "./base-entity.model";

export interface Rule extends BaseEntity {
    roleKey?: string | null;
    libelle?: string | null;
    permissions?: number[] | null;
}
