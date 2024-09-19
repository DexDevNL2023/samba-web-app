import { ToastService } from './toast.service';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError, of } from "rxjs";
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

  constructor(private http: HttpClient, private toastService: ToastService) { }

  // Récupérer les informations de l'entreprise actuelle
  getCurrentCompany(): Observable<Company> {
    return this.http.get<RessourceResponse<Company>>(`${this.baseUrl}/api/companies/current`).pipe(
      map(response => this.handleResponse(response, 'Entreprise actuelle récupérée avec succès!')),
      catchError(() => of(null))
    );
  }

  // Mettre à jour les informations de l'entreprise
  updateCompany(company: Company): Observable<Company> {
    return this.http.put<RessourceResponse<Company>>(`${this.baseUrl}/api/companies`, company).pipe(
      map(response => this.handleResponse(response, 'Entreprise mise à jour avec succès!')),
      catchError(() => of(null))
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
