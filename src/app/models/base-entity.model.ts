export interface BaseEntity {
  id?: number;
  createdAt?: Date | null;
  createdBy?: string | null;
  modifiedAt?: Date | null;
  modifiedBy?: string | null;
}
