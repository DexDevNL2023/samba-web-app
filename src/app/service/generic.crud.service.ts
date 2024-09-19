import { ToastService } from './toast.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, throwError, of } from 'rxjs';
import { BaseEntity } from '../models/base-entity.model';
import { RessourceResponse } from '../models/ressource.response.model';
import { map, catchError } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export abstract class GenericCrudService<Entity extends BaseEntity> {
  protected baseUrl = environment.apiUrl;
  protected resourceUrl: string;

  constructor(protected http: HttpClient, private toastService: ToastService, protected endpoint: string) {
    this.resourceUrl = `${this.baseUrl}/${endpoint}`;
  }

  // Méthode générique pour créer une nouvelle entité.
  create(entity: Entity): Observable<Entity> {
    return this.http.post<RessourceResponse<Entity>>(`${this.resourceUrl}/create`, entity).pipe(
      map(response => this.handleResponse(response, 'Création')),
      catchError(() => of(null))
    );
  }

  // Méthode générique pour créer plusieurs entités à la fois.
  createAll(entities: Entity[]): Observable<Entity[]> {
    return this.http.post<RessourceResponse<Entity[]>>(`${this.resourceUrl}/create/all`, entities).pipe(
      map(response => this.handleResponse(response, 'Création multiple')),
      catchError(() => of([]))
    );
  }

  // Méthode générique pour mettre à jour une entité existante.
  update(entity: Entity): Observable<Entity> {
    return this.http.put<RessourceResponse<Entity>>(`${this.resourceUrl}/update/${entity.id}`, entity).pipe(
      map(response => this.handleResponse(response, 'Mise à jour')),
      catchError(() => of(null))
    );
  }

  // Méthode générique pour récupérer une entité par son ID.
  find(id: number): Observable<Entity> {
    return this.http.get<RessourceResponse<Entity>>(`${this.resourceUrl}/find/${id}`).pipe(
      map(response => this.handleResponse(response, 'Récupération')),
      catchError(() => of(null))
    );
  }

  // Méthode générique pour récupérer une liste d'entités.
  query(): Observable<Entity[]> {
    return this.http.get<RessourceResponse<Entity[]>>(`${this.resourceUrl}/find/all`).pipe(
      map(response => this.handleResponse(response, 'Liste')),
      catchError(() => of([]))
    );
  }

  // Méthode générique pour supprimer une entité par son ID.
  delete(id: number): Observable<void> {
    return this.http.delete<RessourceResponse<void>>(`${this.resourceUrl}/delete/${id}`).pipe(
      map(response => this.handleResponse(response, 'Suppression')),
      catchError(() => of())
    );
  }

  // Méthode générique pour supprimer une liste d'entités par leurs IDs.
  deleteAll(ids: number[]): Observable<void> {
    return this.http.delete<RessourceResponse<void>>(`${this.resourceUrl}/delete/all`, { params: { ids: ids.join(',') } }).pipe(
      map(response => this.handleResponse(response, 'Suppression multiple')),
      catchError(() => of())
    );
  }

  // Méthode générique pour récupérer des entités avec pagination.
  getByPage(page: number, size: number): Observable<Entity[]> {
    return this.http.get<RessourceResponse<Entity[]>>(`${this.resourceUrl}/page`, { params: { page, size } }).pipe(
      map(response => this.handleResponse(response, 'Récupération paginée')),
      catchError(() => of([]))
    );
  }

  // Gestion de la réponse API
  protected handleResponse<T>(response: RessourceResponse<T>, action: string): T {
    if (response.success) {
      this.toastService.showToast('success', `${action} réussie`, response.message);
    } else {
      this.toastService.showToast('error', `${action} échouée`, response.message);
    }
    return response.content;
  }

  // Gestion des erreurs
  protected handleError(error: any, action: string): Observable<never> {
    this.toastService.showToast('error', `${action} échouée`, 'Une erreur est survenue.');
    return throwError(error);
  }
}