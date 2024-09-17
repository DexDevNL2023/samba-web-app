import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { Company } from "../models/company.model";
import { map, catchError } from 'rxjs/operators';
import { RessourceResponse } from './../models/ressource.response.model';


@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  // URL de base pour les requêtes API, lue à partir de l'environnement.
  protected baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Récupérer les informations de l'entreprise actuelle
  getCurrentCompany(): Observable<Company> {
    return this.http.get<RessourceResponse<Company>>(`${this.baseUrl}/api/companies/current`).pipe(
      map(response => this.handleResponse(response, 'Entreprise actuelle récupérée avec succès!')),
      catchError(error => this.handleError(error, 'Erreur lors de la récupération de l\'entreprise actuelle'))
    );
  }

  // Mettre à jour les informations de l'entreprise
  updateCompany(company: Company): Observable<Company> {
    return this.http.put<RessourceResponse<Company>>(`${this.baseUrl}/api/companies`, company).pipe(
      map(response => this.handleResponse(response, 'Entreprise mise à jour avec succès!')),
      catchError(error => this.handleError(error, 'Erreur lors de la mise à jour de l\'entreprise'))
    );
  }

  // Gestion des erreurs pour les requêtes API
  private handleResponse(response: RessourceResponse<Company>, successMessage: string): Company {
    // Ajoutez votre logique de gestion des réponses ici
    console.log(successMessage, response);
    return response.content;
  }

  private handleError(error: any, errorMessage: string): Observable<never> {
    // Ajoutez votre logique de gestion des erreurs ici
    console.error(errorMessage, error);
    return throwError(error);
  }
}
