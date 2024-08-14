import { BaseEntity } from "./base-entity.model";

export interface Permission extends BaseEntity {
    permissionKey?: string | null;
    libelle?: string | null;
}
