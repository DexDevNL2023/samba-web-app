export interface RessourceResponse<T> {
  success: boolean;
  message: string;
  content: T;
}