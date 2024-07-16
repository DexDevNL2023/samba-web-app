import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { BaseEntity } from '../models/base-entity.model';
import { EntityByBranch } from '../models/entity-by-branch.model';


// Marque le service comme injectable et disponible pour l'injection de dépendances.
@Injectable({
  providedIn: 'root'
})
export abstract class GenericCrudService<Entity extends BaseEntity> {
  // URL de base pour les requêtes API, lue à partir de l'environnement.
  protected baseUrl = environment.apiUrl;
  // URL complète de la ressource, initialisée dans le constructeur.
  protected resourceUrl: string;

  // Constructeur injectant HttpClient et définissant l'URL de la ressource.
  constructor(protected http: HttpClient, protected endpoint: string) {
    this.resourceUrl = `${this.baseUrl}/${endpoint}`;
  }

  // Méthode générique pour créer une nouvelle entité.
  create(entity: Entity): Observable<Entity> {
    // Effectue une requête POST et mappe la réponse pour convertir les dates du serveur.
    return this.http.post<Entity>(this.resourceUrl, entity);
  }

  // Méthode générique pour mettre à jour une entité existante.
  update(entity: Entity): Observable<Entity> {
    // Effectue une requête PUT et mappe la réponse pour convertir les dates du serveur.
    return this.http.put<Entity>(`${this.resourceUrl}/${this.getEntityIdentifier(entity)}`, entity);
  }

  // Méthode générique pour récupérer une entité par son ID.
  find(id: number): Observable<Entity> {
    // Effectue une requête GET et mappe la réponse pour convertir les dates du serveur.
    return this.http.get<Entity>(`${this.resourceUrl}/${id}`);
  }

  // Méthode générique pour récupérer une liste d'entités.
  query(): Observable<Entity[]> {
    // Effectue une requête GET et mappe la réponse pour convertir les dates du serveur.
    return this.http.get<Entity[]>(this.resourceUrl);
  }

  // Méthode générique pour récupérer une liste d'entités.par branche
  queryByBranch(): Observable<EntityByBranch<Entity>[]> {
    // Effectue une requête GET et mappe la réponse pour convertir les dates du serveur.
    return this.http.get<EntityByBranch<Entity>[]>(this.resourceUrl);
  }

  // Méthode générique pour supprimer une entité par son ID.
  delete(id: number): Observable<void> {
    // Effectue une requête DELETE.
    return this.http.delete<void>(`${this.resourceUrl}/${id}`);
  }

  // Méthode pour obtenir l'identifiant d'une entité (à implémenter dans les services dérivés).
  protected getEntityIdentifier(entity: Pick<Entity, 'id'>): number {
    // Retourne l'identifiant de l'entité.
    return entity.id;
  }
}
