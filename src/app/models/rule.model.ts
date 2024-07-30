import { BaseEntity } from "./base-entity.model";
import { Permission } from "./permission.model";

export interface Rule extends BaseEntity {
    moduleKey?: string | null;
    module?: string | null;
    permissions?: Permission[] | null;
    permissionIds?: number[] | null;
}
