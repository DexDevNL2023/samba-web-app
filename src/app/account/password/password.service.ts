import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PasswordService {
  private http = inject(HttpClient);

  // Déclaration de l'URL de base pour les requêtes API
  protected baseUrl = environment.apiUrl;

  save(newPassword: string, currentPassword: string): Observable<{}> {
    return this.http.post(`${this.baseUrl}/api/account/change-password`, { currentPassword, newPassword });
  }
}
