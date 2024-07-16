import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PasswordResetFinishService {
  private http = inject(HttpClient);

  // Déclaration de l'URL de base pour les requêtes API
  protected baseUrl = environment.apiUrl;

  save(key: string, newPassword: string): Observable<{}> {
    return this.http.post(`${this.baseUrl}/api/account/reset-password/finish`, { key, newPassword });
  }
}
