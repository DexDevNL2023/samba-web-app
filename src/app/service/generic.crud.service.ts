import { ToastService } from './toast.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
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
    return this.http.post<RessourceResponse<Entity>>(this.resourceUrl, entity).pipe(
      map(response => this.handleResponse(response, 'Création')),
      catchError(error => this.handleError(error, 'Création'))
    );
  }

  // Méthode générique pour mettre à jour une entité existante.
  update(entity: Entity): Observable<Entity> {
    return this.http.put<RessourceResponse<Entity>>(`${this.resourceUrl}/${this.getEntityIdentifier(entity)}`, entity).pipe(
      map(response => this.handleResponse(response, 'Mise à jour')),
      catchError(error => this.handleError(error, 'Mise à jour'))
    );
  }

  // Méthode générique pour récupérer une entité par son ID.
  find(id: number): Observable<Entity> {
    return this.http.get<RessourceResponse<Entity>>(`${this.resourceUrl}/${id}`).pipe(
      map(response => this.handleResponse(response, 'Récupération')),
      catchError(error => this.handleError(error, 'Récupération'))
    );
  }

  // Méthode générique pour récupérer une liste d'entités.
  query(): Observable<Entity[]> {
    return this.http.get<RessourceResponse<Entity[]>>(this.resourceUrl).pipe(
      map(response => this.handleResponse(response, 'Liste')),
      catchError(error => this.handleError(error, 'Liste'))
    );
  }

  // Méthode générique pour supprimer une entité par son ID.
  delete(id: number): Observable<void> {
    return this.http.delete<RessourceResponse<void>>(`${this.resourceUrl}/${id}`).pipe(
      map(response => this.handleResponse(response, 'Suppression')),
      catchError(error => this.handleError(error, 'Suppression'))
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

  protected getEntityIdentifier(entity: Pick<Entity, 'id'>): number {
    return entity.id;
  }
}