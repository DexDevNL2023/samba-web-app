import { HttpHeaders, HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry, catchError, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { Company } from "../models/company.model";


@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  // URL de base pour les requêtes API, lue à partir de l'environnement.
  protected baseUrl = environment.apiUrl;

  constructor(private httpCient: HttpClient) { }

  getParametres(): Observable<Company> {
    return this.httpCient.get<Company>(`${this.baseUrl}/company/parametres`);
  }

  update(company: Company): Observable<Company> {
    return this.httpCient.put<Company>(`${this.baseUrl}/company/update/`+company.id, company);
  }
}
